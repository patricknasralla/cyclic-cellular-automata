in vec2 vUv;

uniform sampler2D ccaState;
uniform sampler2D previousDraw;
uniform float states;
uniform vec2 resolution;

// shading - Consider adding these to the UI so that they can be tweaked in real time!
uniform vec3  diffuseColor;
uniform vec3  ambientColor;
uniform vec3  lightColor;
uniform vec3  lightDirection;
uniform float lightIntensity;
uniform float focalDistance;
uniform float metalness;
uniform float roughness;

const float MAX_BLUR = 10.0;

#define SPECULAR_COEF 0.04
#define RECIPROCAL_PI 0.31830988618
#define EPSILON 1e-6

struct Material
{
  vec3  diffuseColor;
  float specularRoughness;
  vec3  specularColor;
};

struct IncidentLight
{
  vec3 color;
  vec3 direction;
};

struct ReflectedLight
{
  vec3 directDiffuse;
  vec3 directSpecular;
  vec3 indirectDiffuse;
  vec3 indirectSpecular;
};


// Gaussian blur (note, expensive)
float Blur(vec2 id, int amount)
{
  float avg = 0.0;
  for (int x = -amount; x <= amount; x++)
  {
    for (int y = -amount; y <= amount; y++)
    {
      vec2 coord = (id.xy + vec2(x, y)) / resolution;
      avg += texture(ccaState, coord).r;
    }
  }

  avg /= pow(float(amount) * 2.0 + 1.0, 2.0);

  return avg;
}


/*******************************************************
 * PBR shading (modified from three.js implementation) *
 *******************************************************/

// Lambertian diffuse
vec3 BRDF_Diffuse_Lambert(vec3 diffuseColor)
{
  return RECIPROCAL_PI * diffuseColor;
}

// Optimized fresnel variant (presented by Epic at SIGGRAPH '13)
// https://cdn2.unrealengine.com/Resources/files/2013SiggraphPresentationsNotes-26915738.pdf
vec3 F_Schlick(vec3 specularColor, float dotLH)
{
  float fresnel = exp2((-5.55473 * dotLH - 6.98316) * dotLH);
  return(1.0 - specularColor) * fresnel + specularColor;
}

// Moving Frostbite to Physically Based Rendering 3.0 - page 12, listing 2
// https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
float G_GGX_SmithCorrelated(float alpha, float dotNL, float dotNV)
{
  float a2 = pow(alpha, 2.0);

  // dotNL and dotNV are explicitly swapped. This is not a mistake.
  float gv = dotNL * sqrt(a2 + (1.0 - a2) * pow(dotNV, 2.0));
  float gl = dotNV * sqrt(a2 + (1.0 - a2) * pow(dotNL, 2.0));
  return 0.5 / max(gv + gl, EPSILON);
}


// Microfacet Models for Refraction through Rough Surfaces - equation (33)
// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html
// alpha is "roughness squared" in Disney’s reparameterization
float D_GGX(float alpha, float dotNH)
{
  float a2 = pow(alpha, 2.0);
  float denom = pow(dotNH, 2.0) * (a2 - 1.0) + 1.0; // avoid alpha = 0 with dotNH = 1

  return RECIPROCAL_PI * a2 / pow(denom, 2.0);
}

// GGX Distribution, Schlick Fresnel, GGX-Smith Visibility
vec3 BRDF_Specular_GGX(float dotNL, IncidentLight light, Material mat, vec3 normal, vec3 viewDir)
{
  float alpha = pow(mat.specularRoughness, 2.0); // UE4's roughness
  vec3 halfDir = normalize(light.direction + viewDir);
  float dotNV = clamp(dot(normal, viewDir), 0.0, 1.0);
  float dotNH = clamp(dot(normal, halfDir), 0.0, 1.0);
  float dotLH = clamp(dot(light.direction, halfDir), 0.0, 1.0);

  vec3 F = F_Schlick(mat.specularColor, dotLH);
  float G = G_GGX_SmithCorrelated(alpha, dotNL, dotNV);
  float D = D_GGX(alpha, dotNH);

  return F * (G * D);
}

vec3 Shade(IncidentLight light, Material mat, vec3 normal, vec3 viewDir)
{
  float dotNL = clamp(dot(normal, light.direction), 0.0, 1.0);
  vec3 irradiance = dotNL * light.color;

  ReflectedLight rLight;
  rLight.indirectDiffuse = ambientColor.rgb * 0.4 * 0.4 * BRDF_Diffuse_Lambert(mat.diffuseColor);
  rLight.directDiffuse = irradiance * BRDF_Diffuse_Lambert(mat.diffuseColor);
  rLight.directSpecular = irradiance * BRDF_Specular_GGX(dotNL, light, mat, normal, viewDir);

  return rLight.directDiffuse + rLight.indirectDiffuse + rLight.directSpecular;
}

vec3 GetNormal(vec2 coord)
{
  vec2 upCoord = (coord + vec2(0.0, 1.0)) / resolution;
  vec2 downCoord = (coord + vec2(0.0, -1.0)) / resolution;
  vec2 rightCoord = (coord + vec2(1.0, 0.0)) / resolution;
  vec2 leftCoord = (coord + vec2(-1.0, 0.0)) / resolution;

  float upValue = texture(ccaState, upCoord).r;
  float downValue = texture(ccaState, downCoord).r;
  float rightValue = texture(ccaState, rightCoord).r;
  float leftValue = texture(ccaState, leftCoord).r;

  vec3 result = vec3(2.0 * (rightValue - leftValue), 2.0 * (upValue - downValue), 1.0);

  return result;
}


// Working out how this shader works has been left as an exercise for the reader. ;)
void main() {

  int blurAmount = int(round(focalDistance * 5.0));
  float value = (Blur(gl_FragCoord.xy, blurAmount) / states) * 30.0; // normalized by number of states for similar effect across values.
  vec3 surfacePos = vec3(gl_FragCoord.x, gl_FragCoord.y, value);
  vec3 viewDir = normalize(vec3(0.0, 1.0, 0.0) - surfacePos);
  vec3 normal = GetNormal(gl_FragCoord.xy);

  Material material;
  material.diffuseColor = (diffuseColor.rgb * value) * (1.0 - metalness);
  material.specularRoughness = clamp(roughness, 0.04, 1.0);
  material.specularColor = mix(vec3(SPECULAR_COEF, SPECULAR_COEF, SPECULAR_COEF), diffuseColor.rgb * value, metalness);

  IncidentLight light;
  light.color = lightColor.rgb * lightIntensity * lightIntensity;
  light.direction = normalize(lightDirection);

  vec3 color = Shade(light, material, normal, viewDir);

  gl_FragColor = vec4(color, 1.0);
}
