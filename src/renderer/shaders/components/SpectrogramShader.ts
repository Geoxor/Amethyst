import { VISUALIZER_BIN_COUNT } from "@shared/constants.js";

export const SpectrogramShader = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_scrollSpeed;
uniform sampler2D u_backbuffer;
uniform float[${VISUALIZER_BIN_COUNT}] u_amplitudes;

uniform vec3 u_color0;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform vec3 u_color4;

vec3 gradientColor(float t) {
  if (t < 0.25) {
    return mix(u_color0, u_color1, t / 0.25);
  } else if (t < 0.5) {
    return mix(u_color1, u_color2, (t - 0.25) / 0.25);
  } else if (t < 0.75) {
    return mix(u_color2, u_color3, (t - 0.5) / 0.25);
  } else {
    return mix(u_color3, u_color4, (t - 0.75) / 0.25);
  }
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float amplitude = u_amplitudes[int(uv.y * float(u_amplitudes.length()))];
  amplitude = clamp(pow(amplitude, 2.0), 0.0, 1.0);

  if (gl_FragCoord.x >= u_resolution.x - 0.5) {
    vec3 color = gradientColor(amplitude);
    gl_FragColor = vec4(color, 1.0);
  } else {
    gl_FragColor = texture2D(u_backbuffer, vec2(uv.x + (u_scrollSpeed / u_resolution.x), uv.y));
  }
}
`;
