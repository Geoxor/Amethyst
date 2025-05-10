import {VISUALIZER_BIN_COUNT} from "@shared/constants.ts";

export const SpectrogramShader = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform sampler2D u_backbuffer;
  uniform float[${VISUALIZER_BIN_COUNT}] u_amplitudes;
  uniform vec3 u_color;

  void main(){
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float amplitude = u_amplitudes[int(uv.y * float(u_amplitudes.length()))];
    amplitude = clamp(pow(amplitude, 2.0), 0.0, 1.0);

    // If last column
    if (gl_FragCoord.x >= u_resolution.x - 0.5) {
      gl_FragColor = vec4(u_color * amplitude, 1.0);
    } else {
      // Get the color of the next column (x + 1)
      gl_FragColor = texture2D(u_backbuffer, vec2(uv.x + (1.0 / u_resolution.x), uv.y));
    }
  }
`;