<script setup lang="ts">
import { watch } from "vue";
import { amethyst } from "@/amethyst";
import CoverArt from "@/components/CoverArt.vue";
import ShaderCanvas from "@/components/ShaderCanvas.vue";

const props = defineProps<{
  ambientBackgroundImage?: string,
  node: AudioNode
}>();

// TODO: Maybe use a global analyser for all visuals (e.g. in player.ts)?
const context = props.node.context;
const analyser = context.createAnalyser();

props.node.connect(analyser);

analyser.fftSize = amethyst.state.settings.value.spectrumFftSize;
analyser.smoothingTimeConstant = amethyst.state.settings.value.spectrumSmoothing;
watch(() => amethyst.state.settings.value.spectrumFftSize, () => analyser.fftSize = amethyst.state.settings.value.spectrumFftSize);
watch(() => amethyst.state.settings.value.spectrumSmoothing, () => analyser.smoothingTimeConstant = amethyst.state.settings.value.spectrumSmoothing);

// Don't change these
analyser.maxDecibels = -0;
analyser.minDecibels = -128;

// TODO: Implement loading shaders from disk
const fragmentShader = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_amplitudes[960];
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float amplitude = u_amplitudes[int(uv.x * 960.0)];
    gl_FragColor = vec4(0.5 + 0.5 * sin(gl_FragCoord.x / 256.0 + u_time), 0, cos(uv.y + u_time), 1.0);
  }`;

// TODO: This should be a global function somewhere for other components
const shouldPause = () => amethyst.state.settings.value.pauseVisualsWhenUnfocused && !amethyst.state.window.isFocused;

</script>

<template>
  <shader-canvas
    v-if="amethyst.state.settings.value.useShaderBackground"
    :style="`
      opacity: ${amethyst.state.settings.value.ambientBackgroundOpacity}%;
      filter: blur(${amethyst.state.settings.value.ambientBackgroundBlurStrength}px);
      mix-blend-mode: ${amethyst.state.settings.value.ambientBackgroundBlendMode};
    `"
    :frag-shader="fragmentShader"
    :analyser="analyser"
    :pause-rendering="shouldPause()"
  />

  <div
    v-else-if="ambientBackgroundImage"
    :style="`
      transform: translate(-50%, -50%) scale(${amethyst.state.settings.value.ambientBackgroundZoom}%);
      mix-blend-mode: ${amethyst.state.settings.value.ambientBackgroundBlendMode};
    `"
    class="absolute z-1000 select-none pointer-events-none top-1/2 transform-gpu -translate-y-1/2 left-1/2 -translate-x-1/2 w-full"
  >
    <cover-art
      class="w-full h-full"
      :class="[
        amethyst.state.settings.value.ambientBackgroundSpin && 'animate-spin'
      ]"
      :style="`
      animation-play-amethyst.state: ${shouldPause() ? 'paused' : 'running'};
      animation-duration: ${amethyst.state.settings.value.ambientBackgroundSpinSpeed}s;
      opacity: ${amethyst.state.settings.value.ambientBackgroundOpacity}%;
      filter: blur(${amethyst.state.settings.value.ambientBackgroundBlurStrength}px);
    `"
      :url="ambientBackgroundImage"
    />
  </div>
</template>