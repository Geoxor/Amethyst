<script setup lang="ts">
import { amethyst } from "@/amethyst.js";
import ShaderCanvas from "@/components/ShaderCanvas.vue";
import { getThemeColor } from "@/logic/color";
import { logParabolicSpectrum, normalize8bit } from "@/logic/math";
import { SpectrumShader } from "@/shaders/components/SpectrumShader";
import { VISUALIZER_BIN_COUNT } from "@shared/constants.js";
import * as THREE from "three";
import { watch } from "vue";

const props = defineProps<{
  node: AudioNode,
  accentColor: { r: number, g: number, b: number},
  fftSize: number,
  smoothing: number,
  lineThickness: number,
  maxDecibels: number,
  minDecibels: number,
  fillOpacity: number,
  opacityFalloff: number,
  paused?: boolean,
}>();

const context = props.node.context;
const analyser = context.createAnalyser();

props.node.connect(analyser);

const updateAnalyser = () => {
  analyser.fftSize = props.fftSize;
  analyser.smoothingTimeConstant = props.smoothing;
  analyser.maxDecibels = props.maxDecibels;
  analyser.minDecibels = props.minDecibels;
};

updateAnalyser();

watch(() => [props.fftSize, props.smoothing, props.maxDecibels, props.minDecibels], updateAnalyser);
amethyst.state.on("theme:change", () => {
  setTimeout(() => {
    const accentColor = getThemeColor("--accent");
    uniformData.u_color.value.set(
        normalize8bit(accentColor.r),
        normalize8bit(accentColor.g),
        normalize8bit(accentColor.b)
    );
  }, 100);
});
watch(() => [props.lineThickness, props.fillOpacity, props.opacityFalloff], () => {
  uniformData.u_line_thickness.value = props.lineThickness;
  uniformData.u_fill_opacity.value = props.fillOpacity;
  uniformData.u_opacity_falloff.value = props.opacityFalloff;
});

const uniformData = {
  u_color: {value: new THREE.Vector3(
    normalize8bit(props.accentColor.r),
    normalize8bit(props.accentColor.g),
    normalize8bit(props.accentColor.b)
  )},
  u_amplitudes: {value: new Float32Array(VISUALIZER_BIN_COUNT)},
  u_fill_opacity: {value: props.fillOpacity},
  u_line_thickness: {value: props.lineThickness},
  u_opacity_falloff: {value: props.opacityFalloff},
};

const render = (uniforms: Record<string, any>) => {
  const spectrum = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(spectrum);
  uniforms.u_amplitudes.value = logParabolicSpectrum(spectrum, VISUALIZER_BIN_COUNT);
};
</script>

<template>
  <div class="relative overflow-hidden w-full h-full rounded-4px">
    <shader-canvas
      class="origin-top-left absolute"
      :frag-shader="SpectrumShader"
      :analyser="analyser"
      :pause-rendering="paused"
      :uniforms="uniformData"
      @on-render="render"
    />
  </div>
</template>
