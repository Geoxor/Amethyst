<script setup lang="ts">
import { amethyst } from "@/amethyst";
import CoverArt from "@/components/CoverArt.vue";
import ShaderCanvas from "@/components/ShaderCanvas.vue";

defineProps<{
  ambientBackgroundImage?: string,
}>();

</script>

<template>
  <shader-canvas
    v-if="amethyst.state.settings.value.shader.use"
    class="absolute select-none pointer-events-none z-1000"
    :style="`
      opacity: ${amethyst.state.settings.value.appearance.ambientBackground.opacity}%;
      filter: blur(${amethyst.state.settings.value.appearance.ambientBackground.blurStrength}px);
      mix-blend-mode: ${amethyst.state.settings.value.appearance.ambientBackground.blendMode};
    `"
    :frag-shader="amethyst.state.shaders.value.getSelectedShader()"
    :pause-rendering="amethyst.shouldPauseAnimations()"
  />

  <div
    v-else-if="ambientBackgroundImage"
    :style="`
      transform: translate(-50%, -50%) scale(${amethyst.state.settings.value.appearance.ambientBackground.zoom}%);
      mix-blend-mode: ${amethyst.state.settings.value.appearance.ambientBackground.blendMode};
    `"
    class="absolute z-1000 select-none pointer-events-none top-1/2 transform-gpu -translate-y-1/2 left-1/2 -translate-x-1/2 w-full"
  >
    <cover-art
      class="w-full h-full"
      :class="[
        amethyst.state.settings.value.appearance.ambientBackground.spin && 'animate-spin'
      ]"
      :style="`
      animation-play-amethyst.state: ${amethyst.shouldPauseAnimations() ? 'paused' : 'running'};
      animation-duration: ${amethyst.state.settings.value.appearance.ambientBackground.spinSpeed}s;
      opacity: ${amethyst.state.settings.value.appearance.ambientBackground.opacity}%;
      filter: blur(${amethyst.state.settings.value.appearance.ambientBackground.blurStrength}px);
    `"
      :url="ambientBackgroundImage"
    />
  </div>
</template>