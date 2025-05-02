<script setup lang="ts">
import { amethyst } from "@/amethyst";
import CoverArt from "@/components/CoverArt.vue";
import ShaderCanvas from "@/components/ShaderCanvas.vue";

defineProps<{
  ambientBackgroundImage?: string,
}>();

// TODO: Implement loading shaders from disk (so users can use their own shaders)
// This is just an example shader for now
const fragmentShader = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    gl_FragColor = vec4(uv.x + 0.5 + 0.5 * sin(u_time + uv.y), 0.0, 1.0 - uv.x, 1.0);
  }`;

// TODO: This should be a global function somewhere for other components
const shouldPause = () => amethyst.state.settings.value.pauseVisualsWhenUnfocused && !amethyst.state.window.isFocused;

</script>

<template>
  <shader-canvas
    v-if="amethyst.state.settings.value.shader.use"
    class="absolute select-none pointer-events-none z-1000"
    :style="`
      opacity: ${amethyst.state.settings.value.ambientBackgroundOpacity}%;
      filter: blur(${amethyst.state.settings.value.ambientBackgroundBlurStrength}px);
      mix-blend-mode: ${amethyst.state.settings.value.ambientBackgroundBlendMode};
    `"
    :frag-shader="fragmentShader"
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