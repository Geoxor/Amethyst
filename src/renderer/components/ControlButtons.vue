<script lang="ts" setup>
import { useElectron, useState } from "../amethyst";

const electron = useElectron();
const state = useState();
</script>

<template>
  <div class="flex no-drag">
    <button class="controlButton cursor-pointer hover:bg-gray-300 active:bg-blue-500" @click="electron.minimize()">
      <i-fluency-minimize />
    </button>

    <button v-if="!state.state.isMaximized" class="controlButton cursor-pointer hover:bg-gray-300 active:bg-blue-500" @click="electron.maximize()">
      <i-fluency-maximize />
    </button>

    <button v-if="state.state.isMaximized" class="controlButton cursor-pointer hover:bg-gray-300 active:bg-blue-500" @click="electron.unmaximize()">
      <i-fluency-shrink />
    </button>

    <button class="controlButton cursor-pointer hover:bg-red-500 active:text-white hover:text-white fill-current active:bg-red-400" @click="electron.close()">
      <i-fluency-x />
    </button>
  </div>
</template>

<style scoped lang="postcss">
.controlButton {
  @apply hover:text-white h-full  flex items-center justify-center py-1.5 px-4 text-sm;

  svg {
    @apply w-3 h-3;
  }
}
</style>
