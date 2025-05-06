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
    float dist = (amplitude - uv.y) * u_resolution.y;

    float a = 0.0;
    
    if(abs(dist) <= u_line_thickness) {
      a = 1.0;
    } else {
      // Rescaled uv.y under curve (0.0 for bottom to 1.0 to amplitude)
      float dy = (1.0 - (1.0 - amplitude + uv.y)) / amplitude;
      a = interpolate(1.0, u_fill_opacity, interpolate(1.0, dy, u_opacity_falloff));
    }
    gl_FragColor = vec4(u_color * a, a);
  }
`;