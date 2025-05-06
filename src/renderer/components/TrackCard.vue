<script setup lang="ts">
import { amethyst } from "@/amethyst";
import type { Track } from "@/logic/track";
import { Icon } from "@iconify/vue";
import CoverArt from "./CoverArt.vue";
import TitleSubtitle from "./v2/TitleSubtitle.vue";

defineProps<{track: Track}>();

</script>

<template>
  <div
    class="flex flex-col gap-2 items-center w-min cursor-pointer overflow-visible hover:underline"
    @click="amethyst.player.play(track)"
  >
    <span class="relative  transition-all duration-100 transform-gpu hover:scale-110">
      <template v-if="amethyst.player.getCurrentTrack() == track">
        <icon
          v-if="amethyst.player.isPlaying.value"
          icon="ic:round-play-arrow"
          class="icon"
        />
        <icon
          v-else
          icon="ic:round-pause"
          class="icon"
        />
      </template>

      <div class="bg-surface-1000">
        <cover-art
          :url="track.getCover()"
          :class="[amethyst.player.getCurrentTrack() == track && 'opacity-35']"
          class="min-w-32 min-h-32 rounded-8px"
        />
      </div>
    </span>
    <title-subtitle
      class="text-center "
      :title="track.getTitleFormatted()"
      :subtitle="track.getArtistsFormatted()"
    />
  </div>
</template>

<style scoped lang="postcss">
.icon {
  @apply h-16 w-16 absolute top-1/2 left-1/2 z-1 transform-gpu -translate-x-1/2 -translate-y-1/2;
}
</style>