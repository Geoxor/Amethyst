export const OscilloscopeShader = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform vec3 u_color;
  uniform sampler2D u_backbuffer;
  uniform sampler2D samples;

  float getSample(float index) {
  
  }

  void main(){
    vec2 uv = gl_FragCoord.xy / u_resolution;
  }
`;