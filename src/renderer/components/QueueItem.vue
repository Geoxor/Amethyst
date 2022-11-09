<script setup lang="ts">
import { usePlayer, useShortcuts, useState } from "@/amethyst";
import { Track } from "@/logic/track";
import LoadingIcon from "@/icons/plumpy/LoadingIcon.vue";
import Cover from "@/components/CoverArt.vue";

const isHoldingControl = useShortcuts().isControlPressed;
const state = useState();
const player = usePlayer();
const props = defineProps<{track: Track}>();

</script>

<template>
  <li
    class="h-4 flex items-center gap-2 w-full hover:text-white list-none relative select-none"
    :class="[
      isHoldingControl && 'control-hover', 
      isHoldingControl ? 'cursor-external-pointer' : 'cursor-default', 
      player.getCurrentTrack()?.path == track.path ? 'text-primary-800' : 'text-primary-900'
    ]"
  >
    <loading-icon
      v-if="track.isLoading"
      class="h-3 animate-spin w-3 min-h-3 min-w-3"
    />
    
    <cover
      v-else-if="state.settings.showMiniCovers"
      class="w-3 h-3"
      :url="(props.track.isLoaded ? props.track.getCover() : state.state.defaultCover) as string"
    />
    
    <p class="align-top py-0.5 text-12px overflow-hidden overflow-ellipsis whitespace-nowrap">
      {{ player.getCurrentTrack()?.path == track.path ? "⏵ " : "" }}{{ track?.getFilename() }}
    </p>
  </li>
</template>
