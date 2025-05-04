import {VISUALIZER_BIN_COUNT} from "@shared/constants";

export const SpectrumShader = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float[${VISUALIZER_BIN_COUNT}] u_amplitudes;
  uniform vec3 u_color;

  void main(){
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float amplitude = u_amplitudes[int(uv.x * float(u_amplitudes.length()))];
    float underCurve = 0.0;
    if(uv.y <= amplitude) {
      underCurve = 1.0;
    }
    gl_FragColor = vec4(u_color * underCurve, underCurve);
  }
`;