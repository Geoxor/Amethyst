precision highp float;

// All the amplitude levels for each frequency 1-22050hz
uniform int u_amplitude[ 4000 ];
uniform int u_height;
uniform float u_vertical_zoom;

// used to index the ampltude array for each bar instance
attribute float idx;

// The amplitude for this bar
varying float point;

const float u_tilt_multiplier = -0.005;

void main(){
  highp int i = int(idx); 
  float tiltOffset = u_tilt_multiplier * float(u_amplitude.length());
  float tilt = (float(i) * u_tilt_multiplier) - tiltOffset;
  point = float(u_amplitude[i]);

  float y = ((position.y + -point) * u_vertical_zoom + tilt) / 255.0 * float(u_height);

  gl_Position = projectionMatrix * vec4(position.x, y, position.z, 1.0 );
}