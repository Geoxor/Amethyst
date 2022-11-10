<script setup lang="ts">
import { usePlayer, useShortcuts, useState } from "@/amethyst";
import EmptyDiv from "@/components/EmptyDiv.vue";
import BroomIcon from "@/icons/plumpy/BroomIcon.vue";
import PlayIcon from "@/icons/plumpy/PlayIcon.vue";
import ExternalLinkIcon from "@/icons/plumpy/ExternalLinkIcon.vue";
import RestartIcon from "@/icons/plumpy/RestartIcon.vue";
import LoadingIcon from "@/icons/plumpy/LoadingIcon.vue";
import ErrorIcon from "@/icons/plumpy/ErrorIcon.vue";
import Cover from "@/components/CoverArt.vue";

import { Track } from "@/logic/track";
import { ref } from "vue";
import BaseChip from "./new/BaseChip.vue";
const state = useState();
const player = usePlayer();
const isHoldingControl = useShortcuts().isControlPressed;
const filterText = ref("");
const invoke = window.electron.ipcRenderer.invoke;

// Context Menu options for this component 
const handleContextMenu = (e: MouseEvent, idx:number, track: Track) => {
  state.openContextMenuAt(e.x, e.y, [
    { title: "Play", icon: PlayIcon, action: () => player.play(idx) },
    { title: "Open in Explorer...", icon: ExternalLinkIcon, action: () => invoke("show-item", [track.path]) },
    { title: "Render cover art", icon: RestartIcon, action: () => track.path },
    { title: "Remove from queue", icon: BroomIcon, action: () => player.queue.remove(track) },
  ]);
};

</script>

<template>
  <div class="flex-col p-2 flex w-full borderRight h-full">
    <input
      v-model="filterText"
      type="text"
      class="border-2 z-30 select-none w-full bg-surface-800 border-surface-600 text-white py-0.25 placeholder-primary-900 placeholder-opacity-75 hover:placeholder-opacity-100 indent-xs text-12px mb-2"
      placeholder="name, album & artist..."
      @keydown.stop
    >
    <empty-div v-if="player.queue.getList().size == 0" />
    <div
      v-else
      class="overflow-auto h-full"
    >
      <table
        class="text-12px text-left w-full"
      >
        <tr>
          <th v-if="state.settings.showMiniCovers" />
          <th>Filename</th>
          <th>Artist</th>
          <th>Album</th>
          <th>Container</th>
          <th>Size</th>
          <th>Duration</th>
        </tr>
        <tr
          v-for="([path, track], i) of 
            Array.from(player.queue.getList())
              .filter(([_, track]) => filterText ? !track.hasErrored : track)
              .filter(([_, track]) => 
                track.getFilename().toLowerCase().includes(filterText)
                || track.getArtistsFormatted().toLowerCase().includes(filterText)
                || track.getAlbumFormatted().toLowerCase().includes(filterText)
              )"
          :key="i"
          :class="[
            isHoldingControl && 'control-hover', 
            isHoldingControl && 'cursor-external-pointer', 
            track.hasErrored && 'opacity-50 not-allowed',
            player.getCurrentTrack()?.path == track.path && 'active'
          ]"
          @contextmenu="handleContextMenu($event, i, track)"
          @keypress.prevent
          @click="isHoldingControl ? invoke('show-item', [path]) : player.play(track)"
        > 
          <td
            v-if="state.settings.showMiniCovers"
            class="min-w-4 w-4"
          >
            <loading-icon
              v-if="track.isLoading"
              class="h-3 animate-spin w-3 min-h-3 min-w-3"
            />

            <error-icon
              v-else-if="track.hasErrored"
              class="h-3 w-3 min-h-3 min-w-3"
            />
    
            <cover
              v-else-if="state.settings.showMiniCovers"
              class="w-3 h-3"
              :url="(track.isLoaded ? track.getCover() : state.state.defaultCover) as string"
            />
          </td>
          <td class="max-w-48 ">
            {{ player.getCurrentTrack()?.path == track.path ? "⏵ " : "" }}{{ track.getFilename() }}
          </td>
          <td class="max-w-48 ">
            {{ track.getArtistsFormatted() }}
          </td>
          <td class="max-w-48 ">
            {{ track.getAlbumFormatted() }}
          </td>
          <td class="min-w-8">
            <BaseChip
              v-if="track.getMetadata()?.format.container"
              class="text-8px"
            >
              {{ track.getMetadata()?.format.container }}
            </BaseChip>
          </td>
          <td class="min-w-16">
            {{ track.getFilesizeFormatted() }}
          </td>
          <td class="max-w-32 ">
            {{ track.getDurationFormatted() }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.control-hover:hover {
  @apply underline;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

td {
  @apply overflow-hidden overflow-ellipsis;
}

tr {
  @apply hover:text-white text-primary-900 h-4;

  &.active {
    @apply text-primary-800;
  }
}

</style>
