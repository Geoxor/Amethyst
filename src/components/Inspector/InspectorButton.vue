<script setup lang="ts">
import { Icon } from "@iconify/vue";
defineProps<{
  name: string;
  icon: string;
}>();
</script>

<template>
  <button
    class="cursor-pointer"
  >
    {{ $t(name) }}
    <icon
      :icon="icon"
      class="h-5-w-5 min-w-5 min-h-5"
    />
  </button>
</template>

<style scoped lang="postcss">
button {
  @apply flex items-center justify-center gap-2 rounded-4px bg-surface-700 py-1 hover:bg-slider-background hover:text-slider-fill active:bg-slider-fill active:text-slider-background transition-colors w-full text-center;
}
</style>
