<script lang="ts" setup>
import { useElectron, useState } from "../amethyst";

const electron = useElectron();
const state = useState();
</script>

<template>
  <div class="flex no-drag">
    <button class="controlButton text-control-minimize-icon cursor-pointer hover:bg-control-minimize-background-hover active:bg-primary" @click="electron.minimize()">
      <i-fluency-minimize />
    </button>

    <button v-if="!state.state.isMaximized" class="controlButton text-control-maximize-icon cursor-pointer hover:bg-control-maximize-background-hover active:bg-primary" @click="electron.maximize()">
      <i-fluency-maximize />
    </button>

    <button v-if="state.state.isMaximized" class="controlButton text-control-maximize-icon cursor-pointer hover:bg-control-maximize-background-hover active:bg-primary" @click="electron.unmaximize()">
      <i-fluency-shrink />
    </button>

    <button class="controlButton text-control-close-icon cursor-pointer hover:bg-control-close-background-hover active:text-control-close-icon-hover hover:text-control-close-icon-hover active:bg-primary" @click="electron.close()">
      <i-fluency-x />
    </button>
  </div>
</template>

<style scoped lang="postcss">
.controlButton {
  @apply h-full fill-current flex items-center justify-center py-1.5 px-4 text-sm;

  svg {
    @apply w-3 h-3;
  }
}
</style>
