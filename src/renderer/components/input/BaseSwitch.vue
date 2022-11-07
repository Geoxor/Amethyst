<script setup lang="ts">
import { useVModel as useModelValue } from "@vueuse/core";
const props = defineProps<{modelValue: boolean}>();
const emits = defineEmits(["update:modelValue"]);
const value = useModelValue(props, "modelValue", emits);
</script>

<template>
  <label
    class="relative inline-block w-8 h-2.5 no-drag"
  >
    <input
      v-model="value"
      type="checkbox"
      class="hidden"
    >
    <span class="slider" />
  </label>
</template>

<style scoped lang="postcss">
.slider {
  @apply bg-surface-500 rounded-full border-2 border-transparent duration-100 absolute cursor-pointer top-0 left-0 right-0 bottom-0;
  &:hover {
    @apply border-2 border-primary-800 bg-surface-600;
  }
}

input:checked + .slider {
  @apply bg-primary-700;
  &:hover {
    @apply bg-primary-800;
  }
}

</style>