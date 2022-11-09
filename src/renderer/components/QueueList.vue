<script setup lang="ts">
import { usePlayer, useShortcuts, useState } from "@/amethyst";
import EmptyDiv from "@/components/EmptyDiv.vue";
import ResizableDiv from "@/components/ResizableDiv.vue";
import BroomIcon from "@/icons/plumpy/BroomIcon.vue";
import PlayIcon from "@/icons/plumpy/PlayIcon.vue";
import RestartIcon from "@/icons/plumpy/RestartIcon.vue";
import QueueItem from "@/components/QueueItem.vue";
import { Track } from "@/logic/track";
import { ref } from "vue";
const state = useState();
const player = usePlayer();
const isHoldingControl = useShortcuts().isControlPressed;
const filterText = ref("");
const invoke = window.electron.ipcRenderer.invoke;

// Context Menu options for this component 
const handleContextMenu = (e: MouseEvent, idx:number, track: Track) => {
  state.openContextMenuAt(e.x, e.y, [
    { title: "Play", icon: PlayIcon, action: () => player.play(idx) },
    { title: "Render cover art", icon: RestartIcon, action: () => player.getCurrentTrack()?.path },
    { title: "Remove from queue", icon: BroomIcon, action: () => player.queue.remove(track) },
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
          placeholder="name, album & artist..."
        >
        <empty-div v-if="player.queue.getList().size == 0" />
      
        <ul
          v-else
          class="overflow-y-auto w-full h-full"
        >
          <queue-item
            v-for="([path, track], i) of 
              Array.from(player.queue.getList())
                .filter(([_, track]) => filterText ? !track.hasErrored : track)
                .filter(([_, track]) => 
                  track.getFilename().toLowerCase().includes(filterText)
                  || track.getArtistsFormatted().toLowerCase().includes(filterText)
                  || track.getAlbumFormatted().toLowerCase().includes(filterText)
                )"
            :key="path"
            :track="track"
            @contextmenu="handleContextMenu($event, i, track)"
            @keypress.prevent
            @click="isHoldingControl ? invoke('show-item', [path]) : player.play(i)"
          />
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
