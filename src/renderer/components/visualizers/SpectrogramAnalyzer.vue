<script setup lang="ts">
import { VISUALIZER_BIN_COUNT } from "@shared/constants";
import * as THREE from "three";
import { watch } from "vue";

import { amethyst } from "@/amethyst.js";
import ShaderCanvas from "@/components/ShaderCanvas.vue";
import { getThemeColorRgb } from "@/logic/color";
import { linearSpectrum, logParabolicSpectrum, normalize8bit } from "@/logic/math";
import { SpectrogramShader } from "@/shaders/components/SpectrogramShader";

const props = defineProps<{
  node: AudioNode,
  accentColor: { r: number, g: number, b: number},
  fftSize: number,
  smoothing: number,
  scrollSpeed: number,
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

function setNormalizedColorVector(vector: THREE.Vector3, cssVarName: string) {
  const [r, g, b] = getThemeColorRgb(cssVarName).map(normalize8bit);
  vector.set(r, g, b);
}

watch(() => [props.fftSize, props.smoothing], updateAnalyser);

watch(() => props.scrollSpeed, (v) => uniformData.u_scrollSpeed.value = v);

amethyst.state.on("theme:change", () => {
  setTimeout(() => {
    setNormalizedColorVector(uniformData.u_color0.value, "--surface-900");
    setNormalizedColorVector(uniformData.u_color1.value, "--surface-500");
    setNormalizedColorVector(uniformData.u_color2.value, "--inspector-color");
    setNormalizedColorVector(uniformData.u_color3.value, "--primary");
    setNormalizedColorVector(uniformData.u_color4.value, "--alert-color");
  }, 100)
});

// Don't change these
analyser.maxDecibels = amethyst.state.settings.metering.spectrogram.logarithmic ? -8 : -16;
analyser.minDecibels = -128;

function getNormalizedColorVector(cssVarName: string) {
  const [r, g, b] = getThemeColorRgb(cssVarName).map(normalize8bit);
  return new THREE.Vector3(r, g, b);
}

const uniformData = {
  u_color0: { value: getNormalizedColorVector("--surface-900") },
  u_color1: { value: getNormalizedColorVector("--surface-500") },
  u_color2: { value: getNormalizedColorVector("--inspector-color") },
  u_color3: { value: getNormalizedColorVector("--primary") },
  u_color4: { value: getNormalizedColorVector("--alert-color") },
  u_amplitudes: { value: new Float32Array(VISUALIZER_BIN_COUNT) },
  u_scrollSpeed: { value: props.scrollSpeed },
};

const render = (uniforms: Record<string, any>) => {
  const spectrum = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(spectrum);
  uniforms.u_amplitudes.value = amethyst.state.settings.metering.spectrogram.logarithmic ? logParabolicSpectrum(spectrum, VISUALIZER_BIN_COUNT) : linearSpectrum(spectrum, VISUALIZER_BIN_COUNT);
};
</script>

<template>
  <div class="relative truncate w-full h-full rounded-4px">
    <shader-canvas
      class="origin-top-left absolute"
      :frag-shader="SpectrogramShader"
      :analyser="analyser"
      :pause-rendering="paused"
      :uniforms="uniformData"
      @on-render="render"
    />
  </div>
</template>
