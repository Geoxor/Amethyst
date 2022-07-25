<script setup lang="ts">
import { useKeyModifier } from "@vueuse/core";
import { ref } from "vue";
import { usePlayer, useState } from "../amethyst";
import { BPM_COMPUTATION_CONCURRENCY, COVERART_RENDERING_CONCURRENCY } from "../state";
const state = useState();
const player = usePlayer();
const isHoldingControl = useKeyModifier("Control");
const isHoldingAlt = useKeyModifier("Alt");
const filterText = ref("");
const invoke = window.electron.ipcRenderer.invoke;
const MAX_CHARS = 36;

const trimString = (string: string, trim: number) => {
  const NUMBER_OF_DOTS = 2;

  if (string.length > trim) {
    const trimmed = string.substring(0, trim - NUMBER_OF_DOTS);

    // check if the trimmed ends with a space
    if (trimmed[trimmed.length - 1] === " ")
      return `${trimmed.trimEnd()}${".".repeat(NUMBER_OF_DOTS + 1)}`;

    return `${trimmed}${".".repeat(NUMBER_OF_DOTS)}`;
  }
  return string;
};

const parseTitle = (path: string) => {
  return path.substring(Math.max(path.lastIndexOf("\\"), path.lastIndexOf("/")) + 1);
};
</script>

<template>
    <ul class="w-full">
      <Transition name="slide-fade">
        <div v-if="state.state.coverProcessQueue > 0" class="flex w-full flex-col">
          <p class="text-xs text-blue-400">
            Processing Covers {{ state.state.coverProcessQueue }} / {{ COVERART_RENDERING_CONCURRENCY }}
          </p>

          <div class="mb-2 mt-0.5 w-full h-1px bg-gray-200" />
        </div>
      </Transition>
      <Transition name="slide-fade">
        <div v-if="state.state.bpmProcessQueue > 0" class="flex w-full flex-col">
          <p class="text-xs text-yellow-400">
            Analyzing BPM {{ state.state.bpmProcessQueue }} / {{ BPM_COMPUTATION_CONCURRENCY }}
          </p>

          <div class="mb-2 mt-0.5 w-full h-1px bg-gray-200" />
        </div>
      </Transition>

      <input v-model="filterText" type="text" class="border-2 border-gray-400 indent-xs text-xs w-full mb-2" placeholder="artists, title & format...">

      <!-- TODO: refactor this mess into a component -->
      <li
        v-for="([song, i]) of player.getQueue().map((song, i) => song.toLowerCase().includes(filterText.toLowerCase()) ? [song, i] : undefined).filter(song => !!song) as [string, number][]"
        :key="song" :class="[isHoldingControl && 'control-hover', isHoldingControl ? 'cursor-external-pointer' : 'cursor-default', i === player.getCurrentlyPlayingIndex() && 'text-queue-text-active']" class=" h-3 mb-0.5 hover:text-queue-text-hover relative select-none" @keypress.prevent
        @click="isHoldingControl ? invoke('show-item', [player.getQueue()[i]]) : player.setCurrentlyPlayingIndex(i)"
      >
        <!-- <cover class="inline align-top w-3 h-3" :song-path="song" /> -->
        <img v-if="state.state.processQueue.has(song)" src="../spinners/spinner.gif" alt="" class="w-3 h-3 absolute top-0.25 -left-0.25">

        <p :class="[state.state.processQueue.has(song) && 'ml-4']" class=" inline align-top text-xs max-w-40 overflow-hidden overflow-ellipsis ">
          {{ i === player.getCurrentlyPlayingIndex() ? "⏵ " : "" }}{{ trimString(isHoldingAlt ? `${song.substring(0, (MAX_CHARS - 3) / 2)}...${song.substring(song.length - (MAX_CHARS - 3) / 2)}` : parseTitle(song), i === player.getCurrentlyPlayingIndex() ? MAX_CHARS - 2 : MAX_CHARS) }}
        </p>
      </li>
    </ul>
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

