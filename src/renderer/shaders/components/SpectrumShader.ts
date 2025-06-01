import { VISUALIZER_BIN_COUNT } from "@shared/constants.js";

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
    int i = int(uv.x * float(u_amplitudes.length()));

    // fixes: https://github.com/Geoxor/Amethyst/issues/827
    int left_i = max(int((uv.x - 1.0 / u_resolution.x) * float(u_amplitudes.length())), 0);
    int right_i = min(int((uv.x + 1.0 / u_resolution.x) * float(u_amplitudes.length())), int(u_amplitudes.length()) - 1);

    float amplitude = u_amplitudes[i];
    float left = u_amplitudes[left_i];
    float right = u_amplitudes[right_i];
    float lowest = min(left, right);
    float dist = (amplitude - uv.y) * u_resolution.y;

    float a = 0.0;
    
    a += float(abs(dist) <= u_resolution.x * 0.005 * u_line_thickness || (uv.y >= lowest && uv.y <= amplitude)) * clamp(sign(dist), 0.0, 1.0);
    a += clamp(sign(amplitude - uv.y), 0.0, 1.0) * interpolate(1.0, u_fill_opacity, pow(1.0 - uv.y, 1.0 - u_opacity_falloff));
    a = clamp(a, 0.0, 1.0);
    gl_FragColor = vec4(u_color * a, a);
  }
`;
