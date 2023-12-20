<script setup lang="ts">
import Slider from "@vueform/slider";
import { useVModel } from "@vueuse/core";

const props = defineProps<{ modelValue?: number | string}>();
const emits = defineEmits(["update:modelValue"]);
const value = useVModel(props, "modelValue", emits);

</script>

<template>
  <div>
    <Slider
      v-model="value"
      v-bind="$attrs"
      show-tooltip="drag"
      tooltip-position="bottom"
    />
  </div>
</template>

<style lang="postcss">
@import "@vueform/slider/themes/default.css";
:root {
  --slider-handle-width: 8px;
  --slider-handle-height: 20px;
  --slider-handle-bg: rgba(var(--text-title));
}

.slider-connect {
  @apply bg-accent bg-opacity-50;
}

.slider-handle {
  @apply bg-accent;
}

.slider-base {
  @apply bg-accent bg-opacity-15;
}

.slider-tooltip {
  @apply bg-accent border-none;
}

</style>