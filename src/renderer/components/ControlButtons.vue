<script lang="ts" setup>
import { syncWindowState, useState } from "../state";

const invoke = window.electron.ipcRenderer.invoke;
const state = useState();

const maximize = () => {
  invoke("maximize");
  syncWindowState();
};

const unmaximize = () => {
  invoke("unmaximize");
  syncWindowState();
};
</script>

<template>
  <div class="flex text-black no-drag">
    <button class="controlButton hover:bg-gray-300 active:bg-blue-500" @click="invoke('minimize')">
      <i-fluency-minimize />
    </button>

    <button v-if="!state.isMaximized" class="controlButton hover:bg-gray-300 active:bg-blue-500" @click="maximize()">
      <i-fluency-maximize />
    </button>

    <button v-if="state.isMaximized" class="controlButton hover:bg-gray-300 active:bg-blue-500" @click="unmaximize()">
      <i-fluency-shrink />
    </button>

    <button class="controlButton hover:bg-red-500 active:text-white hover:text-white fill-current active:bg-red-400" @click="invoke('close')">
      <i-fluency-x />
    </button>
  </div>
</template>

<style scoped lang="postcss">
.controlButton {
  @apply hover:text-white h-full flex items-center justify-center py-1.5 px-4 text-sm;

  svg {
    @apply w-3 h-3;
  }
}
</style>
