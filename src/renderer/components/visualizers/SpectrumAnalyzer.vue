<script setup lang="ts">
import {logParabolicSpectrum, normalize8bit} from "@/logic/math";
import ShaderCanvas from "@/components/ShaderCanvas.vue";
import {VISUALIZER_BIN_COUNT} from "@shared/constants";
import * as THREE from "three";
import { watch } from "vue";

const props = defineProps<{
  node: AudioNode,
  accentColor: { r: number, g: number, b: number},
  fftSize: number,
  smoothing: number,
  spectrogram?: boolean,
  paused?: boolean,
}>();

const context = props.node.context;
const analyser = context.createAnalyser();

props.node.connect(analyser);

const updateAnalyser = () => {
  analyser.fftSize = props.fftSize;
  analyser.smoothingTimeConstant = props.smoothing;
};

updateAnalyser();

watch(() => [props.fftSize, props.smoothing], updateAnalyser);
watch(() => props.accentColor, () => {
  uniformData.u_color.value.set(
    normalize8bit(props.accentColor.r),
    normalize8bit(props.accentColor.g),
    normalize8bit(props.accentColor.b)
  );
});

// Don't change these
analyser.maxDecibels = -0;
analyser.minDecibels = -128;

const uniformData = {
  u_color: {value: new THREE.Vector3(
    normalize8bit(props.accentColor.r),
    normalize8bit(props.accentColor.g),
    normalize8bit(props.accentColor.b)
  )},
  u_amplitudes: {value: new Float32Array(VISUALIZER_BIN_COUNT)},
};

const spectrumShader = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float[${VISUALIZER_BIN_COUNT}] u_amplitudes;
  uniform vec3 u_color;

  void main(){
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float amplitude = u_amplitudes[int(uv.x * float(u_amplitudes.length()))];
    float underCurve = 0.0;
    if(uv.y <= amplitude) {
      underCurve = 1.0;
    }
    gl_FragColor = vec4(u_color * underCurve, underCurve);
  }`;

const spectrogramShader = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform sampler2D u_backbuffer;
  uniform float[${VISUALIZER_BIN_COUNT}] u_amplitudes;
  uniform vec3 u_color;

  void main(){
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float amplitude = u_amplitudes[int(uv.y * float(u_amplitudes.length()))];
    amplitude = clamp(pow(amplitude, 2.0), 0.0, 1.0);

    // If first column
    if (gl_FragCoord.x == 0.5) {
      gl_FragColor = vec4(u_color - amplitude, 1.0);
    } else {
      // Get the color of the previous column (x-1)
      gl_FragColor = texture2D(u_backbuffer, vec2(uv.x - (1.0 / u_resolution.x), uv.y));
    }
  }`;

const render = (uniforms: Record<string, any>) => {
  const spectrum = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(spectrum);
  uniforms.u_amplitudes.value = logParabolicSpectrum(spectrum, VISUALIZER_BIN_COUNT);
};

const getShader = () => props.spectrogram ? spectrogramShader : spectrumShader;
</script>

<template>
  <div class="relative overflow-hidden w-full h-full rounded-4px">
    <shader-canvas
      class="origin-top-left absolute"
      :frag-shader="getShader()"
      :analyser="analyser"
      :pause-rendering="paused"
      :uniforms="uniformData"
      @on-render="render"
    />
  </div>
</template>
