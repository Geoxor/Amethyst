<script setup lang="ts">
import {amethyst} from "@/amethyst";
import CoverArt from "@/components/CoverArt.vue";

defineProps<{
  ambientBackgroundImage?: string
}>();
</script>

<template>
  <div
    v-if="amethyst.state.settings.value.useShaderBackground"
  >

  </div>
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
      animation-play-amethyst.state: ${amethyst.state.settings.value.pauseVisualsWhenUnfocused && !amethyst.state.window.isFocused ? 'paused' : 'running'};
      animation-duration: ${amethyst.state.settings.value.ambientBackgroundSpinSpeed}s;
      opacity: ${amethyst.state.settings.value.ambientBackgroundOpacity}%;
      filter: blur(${amethyst.state.settings.value.ambientBackgroundBlurStrength}px);
    `"
      :url="ambientBackgroundImage"
    />
  </div>
</template>

<style scoped lang="postcss">

</style>