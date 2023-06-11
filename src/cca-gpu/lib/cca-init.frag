uniform float states;

// Hash without Sine (for random number generation)
// from: https://www.shadertoy.com/view/4djSRW
float hashwithoutsine12(vec2 p) {
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

// writes random values to the buffer
void main() {
    float rand = floor(hashwithoutsine12(gl_FragCoord.xy) * states);
    gl_FragColor = vec4(rand, 0.0, 0.0, 1.0);
}
