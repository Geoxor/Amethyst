<script setup lang="ts">
import {logParabolicSpectrum, normalize8bit} from "@/logic/math";
import ShaderCanvas from "@/components/ShaderCanvas.vue";
import {VISUALIZER_BIN_COUNT} from "@shared/constants";
import * as THREE from "three";
import { watch } from "vue";
import {SpectrogramShader} from "@/shaders/components/SpectrogramShader";
import {SpectrumShader} from "@/shaders/components/SpectrumShader";
import { amethyst } from "@/amethyst";
import { getThemeColorRgb } from "@/logic/color";

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
watch(() => amethyst.state.settings.value.theme, () => {
  setTimeout(() => {
    const accentColor = getThemeColorRgb("--accent");
    uniformData.u_color.value.set(
      normalize8bit(accentColor[0]),
      normalize8bit(accentColor[1]),
      normalize8bit(accentColor[2])
    );
  }, 100);
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

const render = (uniforms: Record<string, any>) => {
  const spectrum = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(spectrum);
  uniforms.u_amplitudes.value = logParabolicSpectrum(spectrum, VISUALIZER_BIN_COUNT);
};

const getShader = () => props.spectrogram ? SpectrogramShader : SpectrumShader;
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
