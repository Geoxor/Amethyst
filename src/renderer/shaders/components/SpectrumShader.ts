import {VISUALIZER_BIN_COUNT} from "@shared/constants";

export const SpectrumShader = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float[${VISUALIZER_BIN_COUNT}] u_amplitudes;
  uniform vec3 u_color;
  uniform float u_fill_opacity;
  uniform float u_line_thickness;
  uniform float u_opacity_falloff;

  void main(){
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float amplitude = u_amplitudes[int(uv.x * float(u_amplitudes.length()))];
    float dist = amplitude - uv.y;
    
    float a = 0.0;
    
    if(abs(dist) <= u_line_thickness) {
      a = 1.0;
    } else {
      a = u_fill_opacity * pow(dist, u_opacity_falloff);
    }
    gl_FragColor = vec4(u_color * a, a);
  }
`;