<script setup lang="ts">
import { usePlayer, useState } from "@/amethyst";
import Cover from "@/components/CoverArt.vue";
import ResizableDiv from "@/components/ResizableDiv.vue";
import HeartIcon from "@/icons/plumpy/HeartIcon.vue";
import { useKeyModifier } from "@vueuse/core";
import { ref } from "vue";

const state = useState();
const player = usePlayer();
const isHoldingControl = useKeyModifier("Control");
const filterText = ref("");
const invoke = window.electron.ipcRenderer.invoke;
const parseTitle = (path: string) => path.substring(Math.max(path.lastIndexOf("\\"), path.lastIndexOf("/")) + 1);

// Context Menu options for this component 
const handleContextMenu = (e: MouseEvent, i: number) => {
  state.openContextMenuAt(e.x, e.y, [
    { title: "Play", action: () => player.setCurrentlyPlayingIndex(i) },
    !player.state.favorites.has(player.getQueue()[i])
      ? { title: "Favorite", action: () => player.favorite(player.getQueue()[i]) }
      : { title: "Unfavorite", action: () => player.unfavorite(player.getQueue()[i]) },
    { title: "Render cover art", action: () => player.getCoverArt(player.getQueue()[i]) },
    { title: "Remove from queue", action: () => player.removeItemFromQueue(i) },
  ]);
};

</script>

<template>
  <ResizableDiv class="w-64">
    <div class="flex-col items-center p-2 pr-0 flex max-w-full h-full">
      <input
        v-model="filterText"
        type="text"
        class="border-2 z-30 w-full bg-surface-800 border-surface-600 text-white py-0.25 indent-xs text-12px mb-2"
        placeholder="artists, title & format..."
      >
      <ul class="overflow-y-auto w-full">
        <li
          v-for="([song, i]) of player.getQueue().map((song, i) => song.toLowerCase().includes(filterText.toLowerCase()) ? [song, i] : undefined).filter(song => !!song) as [string, number][]"
          :key="song"
          :class="[isHoldingControl && 'control-hover', isHoldingControl ? 'cursor-external-pointer' : 'cursor-default', i === player.getCurrentlyPlayingIndex() && 'text-primary-800']"
          class="h-4 flex items-center gap-2 w-full hover:text-primary-900 list-none relative select-none"
          @contextmenu="handleContextMenu($event, i)"
          @keypress.prevent
          @click="isHoldingControl ? invoke('show-item', [player.getQueue()[i]]) : player.setCurrentlyPlayingIndex(i)"
        >
          <cover
            v-if="state.settings.showMiniCovers"
            class="w-3 h-3"
            :url="player.getCoverBase64(song)"
          />

          <heart-icon
            v-if="player.state.favorites.has(song)"
            class="h-3 w-3 min-h-3 min-w-3 text-rose-600"
          />

          <p class="align-top py-0.5 text-12px overflow-hidden overflow-ellipsis whitespace-nowrap">
            {{ i === player.getCurrentlyPlayingIndex() ? "⏵ " : "" }}{{ parseTitle(song) }}
          </p>
        </li>
      </ul>
    </div>
  </ResizableDiv>
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
