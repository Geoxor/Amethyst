precision highp float;

// All the amplitude levels for each frequency 1-22500hz
uniform int u_amplitude[ 2048 ];

// used to index the ampltude array for each bar instance
attribute float idx;

// The amplitude for this bar
varying float amp;

void main(){
  highp int index = int(idx); 
  amp = float(u_amplitude[index]);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y * -amp, position.z, 1.0 );
}