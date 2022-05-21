<script setup lang="ts">
import { useKeyModifier } from "@vueuse/core";
import { useState } from "../state";
import Cover from "./Cover.vue";
const state = useState();
const isHoldingControl = useKeyModifier("Control");
const invoke = window.electron.ipcRenderer.invoke;
</script>

<template>
  <div class="min-w-48 max-w-48 p-2 pb-4 flex h-full font-cozette overflow-hidden overflow-y-auto ">
    <ul class="w-full">
      <Transition name="slide-fade">
        <div v-if="state.processQueue > 0" class="flex w-full flex-col">
          <p class="text-xs text-blue-400">
            Processing Covers {{ state.processQueue }} / 10
          </p>

          <div class="mb-2 mt-0.5 w-full h-1px bg-gray-200" />
        </div>
      </Transition>

      <li
        v-for="(song, i) of state.queue" :key="song" :class="isHoldingControl && 'control-hover'" class="h-3 mb-0.25 hover:text-blue-300"
        @click="isHoldingControl ? invoke('show-item', [state.queue[i]]) : state.currentlyPlaying = i"
      >
        <cover class="inline align-top w-3 h-3" :song-path="song" />

        <p class=" inline align-top text-[11px] ml-2 max-w-40 overflow-hidden overflow-ellipsis " :class="isHoldingControl ? 'cursor-pointer' : 'cursor-default'">
          {{ song.substring(song.lastIndexOf("\\") + 1).substring(0, 25) }}{{ song.substring(song.lastIndexOf("\\") + 1).length > 25 ? '..' : '' }}
        </p>
      </li>
    </ul>
  </div>
</template>

<style lang="postcss" scoped>
.control-hover:hover {
  @apply cursor-pointer underline;
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

