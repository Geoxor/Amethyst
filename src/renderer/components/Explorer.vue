<script setup lang="ts">
import { useKeyModifier } from "@vueuse/core";
import { COVERART_RENDERING_CONCURRENCY, useState } from "../state";
import Cover from "./Cover.vue";
const state = useState();
const isHoldingControl = useKeyModifier("Control");
const invoke = window.electron.ipcRenderer.invoke;

const parseTitles = (path: string, trim: number) => {
  // Get everything after the last \
  const fileName = path.substring(path.lastIndexOf("\\") + 1);

  // Trim the text and remove ending space
  const trimmed = fileName.substring(0, trim).trimEnd();

  // Check if the length of the title exceeds the given space
  const isFileNameLessThanTrimmed = fileName.length < trim + 1;

  // Add dots if it exceeds
  return isFileNameLessThanTrimmed ? fileName : `${trimmed}..`;
};
</script>

<template>
  <div class="min-w-64 max-w-64 p-2 pb-4 flex h-full font-cozette overflow-hidden overflow-y-auto " @keypress.prevent>
    <ul class="w-full">
      <Transition name="slide-fade">
        <div v-if="state.state.processQueue > 0" class="flex w-full flex-col">
          <p class="text-xs text-blue-400">
            Processing Covers {{ state.state.processQueue }} / {{ COVERART_RENDERING_CONCURRENCY }}
          </p>

          <div class="mb-2 mt-0.5 w-full h-1px bg-gray-200" />
        </div>
      </Transition>

      <li
        v-for="(song, i) of state.state.player.getQueue()" :key="song" :class="[isHoldingControl ? 'cursor-external-pointer' : 'cursor-default', i === state.state.player.getCurrentlyPlayingIndex() && 'text-blue-500']" class=" h-3 mb-0.5 hover:text-blue-300"
        @click="isHoldingControl ? invoke('show-item', [state.state.player.getQueue()[i]]) : state.state.player.setCurrentlyPlayingIndex(i)"
      >
        <cover class="inline align-top w-3 h-3" :song-path="song" />

        <p class=" inline align-top text-xs ml-2 max-w-40 overflow-hidden overflow-ellipsis ">
          {{ i === state.state.player.getCurrentlyPlayingIndex() ? "⏵ " : "" }}{{ parseTitles(song, i === state.state.player.getCurrentlyPlayingIndex() ? 30 : 32) }}
        </p>
      </li>
    </ul>
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

