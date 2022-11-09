<script setup lang="ts">
import { usePlayer, useShortcuts, useState } from "@/amethyst";
import Cover from "@/components/CoverArt.vue";
import EmptyDiv from "@/components/EmptyDiv.vue";
import ResizableDiv from "@/components/ResizableDiv.vue";
import BroomIcon from "@/icons/plumpy/BroomIcon.vue";
import HeartIcon from "@/icons/plumpy/HeartIcon.vue";
import PlayIcon from "@/icons/plumpy/PlayIcon.vue";
import RestartIcon from "@/icons/plumpy/RestartIcon.vue";
import LoadingIcon from "@/icons/plumpy/LoadingIcon.vue";
import { Track } from "@/logic/track";
import { ref } from "vue";
const state = useState();
const player = usePlayer();
const isHoldingControl = useShortcuts().isControlPressed;
const filterText = ref("");
const invoke = window.electron.ipcRenderer.invoke;

// Context Menu options for this component 
const handleContextMenu = (e: MouseEvent, i: number) => {
  state.openContextMenuAt(e.x, e.y, [
    { title: "Play", icon: PlayIcon, action: () => player.setCurrentlyPlayingIndex(i) },
    !player.state.favorites.has(player.getQueue()[i].path)
      ? { title: "Favorite", icon: HeartIcon, action: () => player.favorite(player.getQueue()[i].path) }
      : { title: "Unfavorite", icon: HeartIcon, action: () => player.unfavorite(player.getQueue()[i].path) },
    { title: "Render cover art", icon: RestartIcon, action: () => player.getCoverArt(player.getQueue()[i].path) },
    { title: "Remove from queue", icon: BroomIcon, action: () => player.removeItemFromQueue(i) },
  ]);
};

</script>

<template>
  <div class="borderRight">
    <resizable-div class="w-64">
      <div class="flex-col items-center p-2 pr-0 flex max-w-full h-full">
        <input
          v-model="filterText"
          type="text"
          class="border-2 z-30 select-none w-full bg-surface-800 border-surface-600 text-white py-0.25 placeholder-primary-900 placeholder-opacity-75 hover:placeholder-opacity-100 indent-xs text-12px mb-2"
          placeholder="artists, title & format..."
        >
        <empty-div v-if="player.getQueue().length == 0" />
      
        <ul
          v-else
          class="overflow-y-auto w-full"
        >
          <li
            v-for="([track, i]) of player.getQueue().map((track, i) => track.getFilename().toLowerCase().includes(filterText.toLowerCase()) ? [track, i] : undefined).filter(track => !!track) as [Track, number][]"
            :key="track.path"
            class="h-4 flex items-center gap-2 w-full hover:text-white list-none relative select-none"
            :class="[
              isHoldingControl && 'control-hover', 
              isHoldingControl ? 'cursor-external-pointer' : 'cursor-default', 
              i == player.getCurrentlyPlayingIndex() ? 'text-primary-800' : 'text-primary-900'
            ]"
            @contextmenu="handleContextMenu($event, i)"
            @keypress.prevent
            @click="isHoldingControl ? invoke('show-item', [player.getQueue()[i]]) : player.playIndex(i)"
          >
            <loading-icon
              v-if="track.isLoading"
              class="h-3 animate-spin w-3 min-h-3 min-w-3"
            />

            <cover
              v-else-if="state.settings.showMiniCovers"
              class="w-3 h-3"
              :url="track.isLoaded ? track.getCover() : state.state.defaultCover"
            />

            <heart-icon
              v-if="player.state.favorites.has(track.path)"
              class="h-3 w-3 min-h-3 min-w-3 text-rose-600"
            />

            <p class="align-top py-0.5 text-12px overflow-hidden overflow-ellipsis whitespace-nowrap">
              {{ i === player.getCurrentlyPlayingIndex() ? "⏵ " : "" }}{{ track?.getFilename() }}
            </p>
          </li>
        </ul>
      </div>
    </resizable-div>
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
</style>
