import {VISUALIZER_BIN_COUNT} from "@shared/constants";

export const SpectrumShader = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float[${VISUALIZER_BIN_COUNT}] u_amplitudes;
  uniform vec3 u_color;
  uniform float u_fill_opacity;
  uniform float u_line_thickness;
  uniform float u_opacity_falloff;
  
  float interpolate(float a, float b, float t) {
    return (1.0 - t) * a + t * b;
  }

  void main(){
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float amplitude = u_amplitudes[int(uv.x * float(u_amplitudes.length()))];
    float left = u_amplitudes[int((uv.x - 1.0 / u_resolution.x) * float(u_amplitudes.length()))];
    float right = u_amplitudes[int((uv.x + 1.0 / u_resolution) * float(u_amplitudes.length()))];
    float lowest = min(left, right);
    float dist = (amplitude - uv.y) * u_resolution.y;

    float a = 0.0;
    
    if(abs(dist) <= u_resolution.x * 0.005 * u_line_thickness || (uv.y >= lowest && uv.y <= amplitude)) {
      a = 1.0;
    } else if(dist > 0.0) {
      a = interpolate(1.0, u_fill_opacity, pow(1.0 - uv.y, 1.0 - u_opacity_falloff));
    }
    gl_FragColor = vec4(u_color * a, a);
  }
`;