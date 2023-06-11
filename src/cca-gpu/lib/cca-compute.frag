in vec2 vUv;

uniform sampler2D ccaState;
uniform vec2 resolution;

uniform uint threshold;
uniform uint states;
uniform int nSize;
uniform bool neighbourhood;


// Gets the score for the Moore neighbourhood
float getScoreMoore(float currentValue) {
  float result = 0.0;

  for (int x = -nSize; x <= nSize ; x++) {
    for (int y = -nSize; y <= nSize ; y++) {

      // skip the center as it is the current cell
      if (x == 0 && y == 0) continue;

      vec2 sampledPos = gl_FragCoord.xy + vec2(x, y);
      float sampledValue = texture(ccaState, sampledPos / resolution.xy).x;

      // this is the "rule". It is arbitrary and can be changed
      if (sampledValue == (mod((currentValue + 1.0), float(states)))) {
        result += 1.0;
      }
    }
  }

  return result;
}

// Gets the score for the Von Neumann neighbourhood
float getScoreVonNeumann(float currentValue) {
  float result = 0.0;

  for (int x = -nSize; x <= nSize; x++) {
    if (x == 0) continue;

    vec2 sampledPos = gl_FragCoord.xy  + vec2(x, 0.0);
    float sampledValue = texture(ccaState, sampledPos / resolution.xy).x;

    if (sampledValue == (mod((currentValue + 1.0), float(states)))) {
      result += 1.0;
    }
  }

  for (int y = -nSize; y <= nSize; y++) {
    if (y == 0) continue;

    vec2 sampledPos = gl_FragCoord.xy  + vec2(0.0, y);
    float sampledValue = texture(ccaState, sampledPos / resolution.xy).x;

    if (sampledValue == (mod((currentValue + 1.0), float(states)))) {
      result += 1.0;
    }
  }

  return result;
}

// This function is called for every pixel in the render and runs in parallel on the GPU.
void main() {
  // Get the current state of the cell from the read texture (gl_FragCoord is the current pixel position)
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 currentValue = texture(ccaState, uv);

  // Calculate the score for the current cell based on the neighbourhood selected.
  float score = neighbourhood == true ? getScoreMoore(currentValue.x) : getScoreVonNeumann(currentValue.x);

  // if the score is greater than or equal to the threshold, increment the state of the cell. Otherwise, keep the current state.
  if (score >= float(threshold)) {
    gl_FragColor = vec4(mod((currentValue.x + 1.0), float(states)), 0.0, 0.0, 1.0);
  } else {
    gl_FragColor = currentValue;
  }
}

