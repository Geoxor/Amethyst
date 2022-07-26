<script setup lang="ts">
import { useKeyModifier } from "@vueuse/core";
import { ref } from "vue";
import { usePlayer, useState } from "../amethyst";
import SmoothScrollableContainer from "./SmoothScrollableContainer.vue";

const state = useState();
const player = usePlayer();
const isHoldingControl = useKeyModifier("Control");
const isHoldingAlt = useKeyModifier("Alt");
const filterText = ref("");
const invoke = window.electron.ipcRenderer.invoke;
const MAX_CHARS = 37;

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
  <div class="flex-col p-2 items-center flex w-64">
    <input v-model="filterText" type="text" class="border-2 z-30 w-full border-gray-400 indent-xs text-xs mb-2" placeholder="artists, title & format...">

    <smooth-scrollable-container class="fixed top-14">
      <!-- TODO: refactor this mess into a component -->
      <li
        v-for="([song, i]) of player.getQueue().map((song, i) => song.toLowerCase().includes(filterText.toLowerCase()) ? [song, i] : undefined).filter(song => !!song) as [string, number][]"
        :key="song"
        :class="[isHoldingControl && 'control-hover', isHoldingControl ? 'cursor-external-pointer' : 'cursor-default', i === player.getCurrentlyPlayingIndex() && 'text-queue-text-active']"
        class="h-3 -ml-3 mb-0.5 max-w-56 hover:text-queue-text-hover list-none relative select-none" 
        @keypress.prevent
        @mousedown="isHoldingControl ? invoke('show-item', [player.getQueue()[i]]) : player.setCurrentlyPlayingIndex(i)">
        <!-- <cover class="inline align-top w-3 h-3" :song-path="song" /> -->
        <img v-if="state.state.processQueue.has(song)" src="../spinners/spinner.gif" alt=""
          class="w-3 h-3 absolute top-0.25 -left-0.25">

        <p :class="[state.state.processQueue.has(song) && 'ml-4']"
          class=" inline align-top text-xs max-w-40 overflow-hidden overflow-ellipsis ">
          {{ i === player.getCurrentlyPlayingIndex() ? "⏵ " : "" }}{{ trimString(isHoldingAlt ? `${song.substring(0,
              (MAX_CHARS - 3) / 2)}...${song.substring(song.length - (MAX_CHARS - 3) / 2)}` : parseTitle(song), i ===
                player.getCurrentlyPlayingIndex() || state.state.processQueue.has(song) ? MAX_CHARS - 4 : MAX_CHARS)
          }}
        </p>
      </li>
    </smooth-scrollable-container>
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

