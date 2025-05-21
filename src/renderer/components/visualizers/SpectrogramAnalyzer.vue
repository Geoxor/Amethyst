<script setup lang="ts">
import { VISUALIZER_BIN_COUNT } from "@shared/constants";
import * as THREE from "three";
import { watch } from "vue";

import { amethyst } from "@/amethyst.js";
import ShaderCanvas from "@/components/ShaderCanvas.vue";
import { getThemeColorRgb } from "@/logic/color";
import { logParabolicSpectrum, normalize8bit } from "@/logic/math";
import { SpectrogramShader } from "@/shaders/components/SpectrogramShader";

const props = defineProps<{
  node: AudioNode,
  accentColor: { r: number, g: number, b: number},
  fftSize: number,
  smoothing: number,
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
amethyst.state.on("theme:change", () => {
  setTimeout(() => {
    uniformData.u_color0.value.set(
      normalize8bit(getThemeColorRgb("--surface-900")[0]),
      normalize8bit(getThemeColorRgb("--surface-900")[1]),
      normalize8bit(getThemeColorRgb("--surface-900")[2])
    );
    uniformData.u_color1.value.set(
      normalize8bit(getThemeColorRgb("--surface-500")[0]),
      normalize8bit(getThemeColorRgb("--surface-500")[1]),
      normalize8bit(getThemeColorRgb("--surface-500")[2])
    );
    uniformData.u_color2.value.set(
      normalize8bit(getThemeColorRgb("--inspector-color")[0]),
      normalize8bit(getThemeColorRgb("--inspector-color")[1]),
      normalize8bit(getThemeColorRgb("--inspector-color")[2])
    );
    uniformData.u_color3.value.set(
      normalize8bit(getThemeColorRgb("--primary")[0]),
      normalize8bit(getThemeColorRgb("--primary")[1]),
      normalize8bit(getThemeColorRgb("--primary")[2])
    );
    uniformData.u_color4.value.set(
      normalize8bit(getThemeColorRgb("--alert-color")[0]),
      normalize8bit(getThemeColorRgb("--alert-color")[1]),
      normalize8bit(getThemeColorRgb("--alert-color")[2])
    );
  }, 100);
});

// Don't change these
analyser.maxDecibels = -16;
analyser.minDecibels = -128;

const uniformData = {
  u_color0: {value: new THREE.Vector3(
    normalize8bit(getThemeColorRgb("--surface-900")[0]),
    normalize8bit(getThemeColorRgb("--surface-900")[1]),
    normalize8bit(getThemeColorRgb("--surface-900")[2])
  )},
  u_color1: {value: new THREE.Vector3(
    normalize8bit(getThemeColorRgb("--surface-500")[0]),
    normalize8bit(getThemeColorRgb("--surface-500")[1]),
    normalize8bit(getThemeColorRgb("--surface-500")[2])
  )},
  u_color2: {value: new THREE.Vector3(
    normalize8bit(getThemeColorRgb("--inspector-color")[0]),
    normalize8bit(getThemeColorRgb("--inspector-color")[1]),
    normalize8bit(getThemeColorRgb("--inspector-color")[2])
  )},
  u_color3: {value: new THREE.Vector3(
    normalize8bit(getThemeColorRgb("--primary")[0]),
    normalize8bit(getThemeColorRgb("--primary")[1]),
    normalize8bit(getThemeColorRgb("--primary")[2])
  )},
  u_color4: {value: new THREE.Vector3(
    normalize8bit(getThemeColorRgb("--alert-color")[0]),
    normalize8bit(getThemeColorRgb("--alert-color")[1]),
    normalize8bit(getThemeColorRgb("--alert-color")[2])
  )},
  u_amplitudes: {value: new Float32Array(VISUALIZER_BIN_COUNT)},
};

const render = (uniforms: Record<string, any>) => {
  const spectrum = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(spectrum);
  uniforms.u_amplitudes.value = logParabolicSpectrum(spectrum, VISUALIZER_BIN_COUNT);
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
