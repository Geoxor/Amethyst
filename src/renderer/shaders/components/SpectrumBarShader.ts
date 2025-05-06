// TODO
const shader = `
  precision highp float;
  
  uniform vec2 u_resolution;
  uniform float[$BAR_COUNT] u_amplitudes;
  uniform vec3 u_color;
  
  void main(){
    vec2 uv = gl_FragCoord.xy / u_resolution;
    // Twice the length to have space between bars and additional 2 on either end
    float barWidth = 1.0 / float(2 * u_amplitudes.length() + 2);
    
    float bx = uv.x / barWidth;
    float amplitude = clamp(u_amplitudes[int(uv.x / (1.0 / float(u_amplitudes.length())))], -60.0, 0.0);
    // Map -60 -> 0 to 0 -> 1
    float amp = (amplitude + 60.0) / 36.0 + 0.025;
    
    float a = 0.0;
    
    // If every other bar (since each has one bar width around it)
    if(floor(fract(bx) / 2.0 + 1.0) == 1.0 && abs(2.0 * uv.y - 1.0) <= amp) {
      // Distance from the center of the bar (0.0 for farthest and 1.0 for being at the center)
      float d = - abs(2.0 * fract(bx) - 1.0) + 1.0;
      a = 1.0;
    }
    gl_FragColor = vec4(u_color * a, a);
  }
`;

export function SpectrumBarShader(bars: number): string {
  return shader.replaceAll("$BAR_COUNT", String(bars));
}