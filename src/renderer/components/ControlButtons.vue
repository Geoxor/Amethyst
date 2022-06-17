<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useElectron, useState } from "../amethyst";

const electron = useElectron(); 
const state = useState();
const route = useRoute();
</script>
  
<template>
  <div class="flex no-drag">
    <button class="controlButton text-control-minimize-icon cursor-pointer hover:bg-control-minimize-background-hover" @click="electron.minimize(route.name as string)">
      <i-fluency-minimize />
    </button>

    <button v-if="!state.state.isMaximized" class="controlButton text-control-maximize-icon cursor-pointer hover:bg-control-maximize-background-hover" @click="electron.maximize(route.name as string)">
      <i-fluency-maximize />
    </button>

    <button v-if="state.state.isMaximized" class="controlButton text-control-maximize-icon cursor-pointer hover:bg-control-maximize-background-hover" @click="electron.unmaximize(route.name as string)">
      <i-fluency-shrink />
    </button>

    <button class="controlButton text-control-close-icon cursor-pointer hover:bg-control-close-background-hover active:text-control-close-icon-hover hover:text-control-close-icon-hover active:bg-secondary" @click="electron.close(route.name as string)">
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
