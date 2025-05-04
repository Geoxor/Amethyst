export const SimpleGradient = `
  precision highp float;

  uniform float u_time;
  uniform vec2 u_resolution;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    gl_FragColor = vec4(uv.x + 0.5 + 0.5 * sin(u_time + uv.y), 0.0, 1.0 - uv.x, 1.0);
  }
`;