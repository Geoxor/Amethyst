const shader = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float[$BAR_COUNT] u_amplitudes;
  uniform vec3 u_color;
  
  float xPadding = 0.05;

  void main() {
    float uvx = (gl_FragCoord.x - xPadding * u_resolution.x) / (u_resolution.x * (1.0 - 2.0 * xPadding));
    if (uvx < 0.0 || uvx > 1.0) {
      gl_FragColor = vec4(0.0);
      return;
    }
    vec2 uv = vec2(uvx, gl_FragCoord.y / u_resolution.y);
    // Twice the length to have space between bars and additional 1 on the end
    float barWidth = 1.0 / float(2 * u_amplitudes.length() + 1);

    float bx = uv.x / barWidth;
    float amplitude = clamp(u_amplitudes[int(uv.x / (1.0 / float(u_amplitudes.length())))], -60.0, 0.0);
    // Map -60db -> 0db to 0 -> 1
    float amp = (amplitude + 60.0) / 60.0 + 2.0 / u_resolution.y;

    // Distance from the center of the bar (0.0 for farthest and 1.0 for being at the center)
    // float d = -abs(2.0 * fract(bx) - 1.0) + 1.0;

    // If every other bar width and distance from vertical center is less or equal to amplitude
    float a = mod(floor(bx), 2.0) * ceil(clamp(amp - abs(2.0 * uv.y - 1.0), 0.0, 1.0));

    gl_FragColor = vec4(u_color * a, a);
  }
`;

export function SpectrumBarShader(bars: number): string {
  return shader.replaceAll("$BAR_COUNT", String(bars));
}