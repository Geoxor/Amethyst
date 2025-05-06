<script setup lang="ts">
import { amethyst } from "@/amethyst";
import type { Track } from "@/logic/track";
import CoverArt from "./CoverArt.vue";
import TitleSubtitle from "./v2/TitleSubtitle.vue";

defineProps<{track: Track}>();

</script>

<template>
  <div
    class="flex flex-col gap-2 items-center w-min cursor-pointer overflow-visible hover:underline"
    @click="amethyst.player.play(track)"
  >
    <cover-art
      :url="track.getCover()"
      class="min-w-32 min-h-32 rounded-8px transition-all duration-100 transform-gpu hover:scale-110"
    />
    <title-subtitle
      class="text-center "
      :title="track.getTitleFormatted()"
      :subtitle="track.getArtistsFormatted()"
    />
  </div>
</template>

<style scoped lang="postcss">

</style>