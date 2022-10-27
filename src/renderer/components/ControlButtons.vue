<script lang="ts" setup>
import { useElectron, useState } from "@/amethyst";
import CloseIcon from "@/icons/fluency/CloseIcon.vue";
import MaximizeIcon from "@/icons/fluency/MaximizeIcon.vue";
import MinimizeIcon from "@/icons/fluency/MinimizeIcon.vue";
import ShrinkIcon from "@/icons/fluency/ShrinkIcon.vue";
const electron = useElectron();
const state = useState();
</script>
  
<template>
  <div class="flex no-drag cursor-pointer">
    <button @click="electron.minimize()">
      <MinimizeIcon />
    </button>

    <button v-if="!state.state.isMaximized" @click="electron.maximize()">
      <MaximizeIcon />
    </button>

    <button v-if="state.state.isMaximized" @click="electron.unmaximize()">
      <ShrinkIcon />
    </button>

    <button class="close" @click="electron.close()">
      <CloseIcon />
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
