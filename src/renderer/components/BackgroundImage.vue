<script setup lang="ts">
import { amethyst } from "@/amethyst.js";
import CoverArt from "@/components/CoverArt.vue";
import ShaderCanvas from "@/components/ShaderCanvas.vue";

defineProps<{
  ambientBackgroundImage?: string,
}>();

</script>

<template>
  <shader-canvas
    v-if="amethyst.state.settings.appearance.shader.use"
    class="absolute select-none pointer-events-none z-1000"
    :style="`
      opacity: ${amethyst.state.settings.appearance.ambientBackground.opacity}%;
      filter: blur(${amethyst.state.settings.appearance.ambientBackground.blurStrength}px);
      mix-blend-mode: ${amethyst.state.settings.appearance.ambientBackground.blendMode};
    `"
    :frag-shader="amethyst.state.shaders.value.getSelectedShader()"
    :pause-rendering="amethyst.shouldPauseAnimations()"
  />

  <div
    v-else-if="ambientBackgroundImage"
    :style="`
      transform: translate(-50%, -50%) scale(${amethyst.state.settings.appearance.ambientBackground.zoom}%);
      mix-blend-mode: ${amethyst.state.settings.appearance.ambientBackground.blendMode};
    `"
    class="z-1000 select-none pointer-events-none absolute-xy w-full"
  >
    <cover-art
      class="w-full h-full"
      :class="[
        amethyst.state.settings.appearance.ambientBackground.spin && 'animate-spin'
      ]"
      :style="`
      animation-play-amethyst.state: ${amethyst.shouldPauseAnimations() ? 'paused' : 'running'};
      animation-duration: ${amethyst.state.settings.appearance.ambientBackground.spinSpeed}s;
      opacity: ${amethyst.state.settings.appearance.ambientBackground.opacity}%;
      filter: blur(${amethyst.state.settings.appearance.ambientBackground.blurStrength}px);
    `"
      :url="ambientBackgroundImage"
    />
  </div>
</template>