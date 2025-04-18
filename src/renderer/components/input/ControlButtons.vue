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
      <minimize-icon />
    </button>

    <button
      v-if="!isMaximized"
      class="maximize"
      @click="emit('maximize')"
    >
      <maximize-icon />
    </button>

    <button
      v-else
      class="unmaximize"
      @click="emit('unmaximize')"
    >
      <unmaximize-icon />
    </button>

    <button
      class="close"
      @click="emit('close')"
    >
      <close-icon />
    </button>
  </div>
</template>

<style scoped lang="postcss">
button {
  @apply h-full fill-current flex items-center justify-center py-1.5 px-4 rounded-4px  hover:text-white hover:bg-surface-600;
  &.close {
    @apply hover:bg-primary hover:text-surface-700 active:text-text_title active:bg-primary;
  }

  svg {
    @apply w-3 h-3;
  }
}
</style>
