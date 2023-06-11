in vec2 vUv;

uniform sampler2D ccaState;
uniform float states;
uniform sampler2D colorMap;

// This Shader is used to render the CCA state to the screen.
void main() {
  // Get the CCA state at the current pixel from the read texture.
  vec4 cca = texture(ccaState, vUv);
  float ccaVal = cca.r;

  // Lookup the color in the color texture based on the CCA state.
  float lookup = clamp(ccaVal / states, 0., 1.);

  // Set the color of the current pixel to the color from the color texture.
  gl_FragColor = texture(colorMap, vec2(lookup, 0.5));
}
