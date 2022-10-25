<script lang="ts" setup>
import { useElectron, useState } from "@/amethyst";
import { useRoute } from "vue-router";
const electron = useElectron();
const state = useState();
const route = useRoute();
</script>
  
<template>
  <div class="flex no-drag cursor-pointer">
    <button @click="electron.minimize(route.name as string)">
      <i-fluency-minimize />
    </button>

    <button v-if="!state.state.isMaximized" @click="electron.maximize(route.name as string)">
      <i-fluency-maximize />
    </button>

    <button v-if="state.state.isMaximized" @click="electron.unmaximize(route.name as string)">
      <i-fluency-shrink />
    </button>

    <button class="close" @click="electron.close(route.name as string)">
      <i-fluency-x />
    </button>
  </div>
</template>

<style scoped lang="postcss">
button {
  @apply h-full fill-current flex items-center justify-center py-1.5 px-4 hover: bg-primary-900 active:bg-primary-800;

  &.close {
    @apply hover: bg-rose-600 active: bg-rose-500;
  }

  svg {
    @apply w-3 h-3;
  }
}
</style>
