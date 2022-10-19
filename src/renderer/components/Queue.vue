<script setup lang="ts">
import { useKeyModifier } from "@vueuse/core";
import { ref } from "vue";
import { usePlayer, useState } from "../amethyst";
import Cover from "./Cover.vue";

const state = useState();
const player = usePlayer();
const isHoldingControl = useKeyModifier("Control");
const filterText = ref("");
const invoke = window.electron.ipcRenderer.invoke;
const parseTitle = (path: string) => path.substring(Math.max(path.lastIndexOf("\\"), path.lastIndexOf("/")) + 1);

</script>

<template>
  <div class="flex-col p-2 items-center flex w-64 h-full borderRight">
    <input v-model="filterText" type="text"
      class="border-2 z-30 w-full bg-surface-800 border-surface-600 text-white py-0.25 indent-xs text-12px mb-2"
      placeholder="artists, title & format...">
    <ul class="overflow-y-scroll w-full">
      <li
        v-for="([song, i]) of player.getQueue().map((song, i) => song.toLowerCase().includes(filterText.toLowerCase()) ? [song, i] : undefined).filter(song => !!song) as [string, number][]"
        :key="song"
        :class="[isHoldingControl && 'control-hover', isHoldingControl ? 'cursor-external-pointer' : 'cursor-default', i === player.getCurrentlyPlayingIndex() && 'text-primary-800']"
        class="h-4 flex gap-2 max-w-59.5 hover:text-primary-900 list-none relative select-none" @keypress.prevent
        @mousedown="isHoldingControl ? invoke('show-item', [player.getQueue()[i]]) : player.setCurrentlyPlayingIndex(i)">

        <cover v-if="state.settings.showMiniCovers" class="w-3 h-3" :song-path="song" />

        <p class="align-top py-0.5 text-12px overflow-hidden overflow-ellipsis whitespace-nowrap">
          {{ i === player.getCurrentlyPlayingIndex() ? "⏵ " : "" }}{{ parseTitle(song) }}
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
 
