<script setup lang="ts">
import { useVModel as useModelValue } from "@vueuse/core";
const props = defineProps<{modelValue: boolean}>();
const emits = defineEmits(["update:modelValue"]);
const value = useModelValue(props, "modelValue", emits);
</script>

<template>
  <label
    class="relative inline-block w-10 min-w-10 h-3 no-drag"
  >
    <input
      v-model="value"
      type="checkbox"
      class="hidden"
    >
    <span class="slider" />
    <p
      :class="[value ? 'text-surface-1000' : 'text-primary-700']"
      class="absolute pointer-events-none  text-8px font-bold top-1/2 left-1/2 transform-gpu -translate-x-1/2 -translate-y-1/2"
    >{{ value ? 'ON' : 'OFF' }}</p>
  </label>
</template>

<style scoped lang="postcss">
.slider {
  @apply bg-surface-600 rounded-full border-2 border-transparent duration-100 absolute cursor-pointer top-0 left-0 right-0 bottom-0;
  &:hover {
    @apply border-2 border-primary-800 bg-surface-600;
  }
}

input:checked + .slider {
  @apply bg-primary-800;
  /* &:hover {
    @apply bg-primary-900;
  } */
}

</style>