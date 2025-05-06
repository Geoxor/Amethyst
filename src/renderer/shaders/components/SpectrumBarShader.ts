// TODO
const shader = `
  precision highp float;
  
  uniform vec2 u_resolution;
  uniform float[$BAR_COUNT] u_amplitudes;
  uniform vec3 u_color;
  
  void main(){
    vec2 uv = gl_FragCoord.xy / u_resolution;
    // Twice the length to have space between bars and additional 2 on either end
    float barWidth = uv.x / (2.0 * float(u_amplitudes.length()) + 2.0);
    
    // If every other bar (since each has one bar width around it)
    if(floor(uv.x / barWidth) % 2 == 1.0) {
      float frac = fract(uv.x / barWidth);
      // Distance from the center of the bar (1.0 for farthest and 0.0 for being at the center)
      float d = 1.0 - 2.0 * frac;
      // TODO
    } else {
      gl_FragColor = vec4(0.0);
    }
  }
`;

export function SpectrumBarShader(bars: number): string {
  return shader.replaceAll("$BAR_COUNT", String(bars));
}