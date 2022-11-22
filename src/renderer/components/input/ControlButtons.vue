
<script lang="ts" setup>
import { CloseIcon, MaximizeIcon, MinimizeIcon, ShrinkIcon, } from "@/icons/fluency";
const emit = defineEmits(["close", "minimize", "maximize", "unmaximize"]);
defineProps<{ isMaximized: boolean }>();
</script>
  
<template>
  <div class="flex no-drag cursor-pointer">
    <button
      class="minimize"
      @click="emit('minimize')"
    >
      <MinimizeIcon />
    </button>

    <button
      v-if="!isMaximized"
      class="maximize"
      @click="emit('maximize')"
    >
      <MaximizeIcon />
    </button>

    <button
      v-else
      class="unmaximize"
      @click="emit('unmaximize')"
    >
      <ShrinkIcon />
    </button>

    <button
      class="close"
      @click="emit('close')"
    >
      <CloseIcon />
    </button>
  </div>
</template>

<style scoped lang="postcss">
button {
  @apply h-full fill-current flex items-center justify-center py-1.5 px-4   hover:text-white hover:bg-primary-800;
  &.close {
    @apply hover:bg-rose-600 active:text-white active:bg-rose-500;
  }

  svg {
    @apply w-3 h-3;
  }
}
</style>
