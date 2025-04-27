precision highp float;

// All the amplitude levels for each frequency 1-22050hz
uniform int u_amplitude[ 960 ];
uniform int u_height;

// used to index the ampltude array for each bar instance
attribute float idx;

// The amplitude for this bar
varying float point;
void main(){
  highp int i = int(idx); 
  point = float(u_amplitude[i]);

  float y = ((position.y + -point)) / 255.0 * float(u_height);

  gl_Position = projectionMatrix * vec4(position.x, y * 1.3, position.z, 1.0 );
}
