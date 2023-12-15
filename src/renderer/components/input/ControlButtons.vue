<script lang="ts" setup>
import { CloseIcon, MinimizeIcon, MaximizeIcon, UnmaximizeIcon } from "@/icons";
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
      <UnmaximizeIcon />
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
  @apply h-full fill-current flex items-center justify-center py-1.5 px-4 rounded-4px  hover:text-white hover:bg-primary-800;
  &.close {
    @apply hover:bg-rose-600 hover:text-black active:text-white active:bg-rose-500;
  }

  svg {
    @apply w-3 h-3;
  }
}
</style>
