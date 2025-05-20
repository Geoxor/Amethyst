<script setup lang="ts">
import { computed } from "vue";

import { amethyst } from "@/amethyst.js";
import CoverArt from "@/components/CoverArt.vue";
import PlaybackButtons from "@/components/PlaybackButtons.vue";
import TitleSubtitle from "@/components/v2/TitleSubtitle.vue";

const currentTrack = computed(() => amethyst.player.getCurrentTrack());

</script>

<template>
  <div class="flex flex-col gap-2 w-full p-2 text-text-title">
    <div class="absolute-xy top-1/3 flex flex-col -z-1 items-center gap-4">
      <cover-art :url="currentTrack?.getCover() || 'https://f4.bcbits.com/img/a2807713690_16.jpg'"
        class="w-72 h-72 rounded-8px " />


      <title-subtitle
        alignment="center"
        class="truncate text-ellipsis"
        :title="currentTrack?.getTitleFormatted() || 'Amethyst'"
        :subtitle="currentTrack?.getArtistsFormatted() || 'Amethyst'" />

      <PlaybackButtons v-if="amethyst.getCurrentPlatform() == 'mobile'" class="relative transform-gpu scale-150"/>
    </div>
  </div>
</template>
