<script setup lang="ts">
import { amethyst } from "@/amethyst.js";
import ShaderCanvas from "@/components/ShaderCanvas.vue";
import { getThemeColorRgb } from "@/logic/color";
import { normalize8bit } from "@/logic/math";
import { SpectrumBarShader } from "@/shaders/components/SpectrumBarShader";
import * as THREE from "three";
import { watch } from "vue";

const props = defineProps<{
  node: AudioNode,
  accentColor: { r: number, g: number, b: number},
  fftSize: number,
  smoothing: number,
  bars: number,
  paused?: boolean,
}>();

const context = props.node.context;
const analyser = context.createAnalyser();
analyser.fftSize = props.fftSize;
analyser.smoothingTimeConstant = props.smoothing;

props.node.connect(analyser);

let shader = SpectrumBarShader(props.bars);

watch(() => props.smoothing, () => analyser.smoothingTimeConstant = props.smoothing);
watch(() => props.fftSize, () => analyser.fftSize = props.fftSize);
amethyst.state.on("theme:change", () => {
  setTimeout(() => {
    const accentColor = getThemeColorRgb("--accent");
    uniformData.u_color.value.set(
        normalize8bit(accentColor[0]),
        normalize8bit(accentColor[1]),
        normalize8bit(accentColor[2])
    );
  }, 100);
});
watch(() => props.bars, () => {
  shader = SpectrumBarShader(props.bars);
  uniformData.u_amplitudes.value = new Float32Array(props.bars);
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
  u_amplitudes: {value: new Float32Array(props.bars)},
};

const render = (uniforms: Record<string, any>) => {
  const spectrum = new Float32Array(analyser.frequencyBinCount);
  analyser.getFloatFrequencyData(spectrum);
  const floatSpectrum = new Float32Array(props.bars);
  for (let i = 0; i < props.bars; i++) {
    floatSpectrum[i] = spectrum[Math.round(i * (spectrum.length / floatSpectrum.length))];
  }
  uniforms.u_amplitudes.value = floatSpectrum;
};
</script>

<template>
  <div class="relative overflow-hidden w-full h-full rounded-[4px]">
    <shader-canvas
      class="origin-top-left absolute"
      :frag-shader="shader"
      :analyser="analyser"
      :pause-rendering="paused"
      :uniforms="uniformData"
      @on-render="render"
    />
  </div>
</template>
