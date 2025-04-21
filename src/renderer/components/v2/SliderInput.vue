<script setup lang="ts">
import Slider from "@vueform/slider";
import { useVModel } from "@vueuse/core";

const props = defineProps<{ modelValue: number, step: number, prefix?: string, suffix: string, max: number, min: number}>();
const emits = defineEmits(["update:modelValue"]);
const value = useVModel(props, "modelValue", emits);

const handleMouseScroll = (e: WheelEvent) => {
  const delta = Math.sign(e.deltaY);
  let newValue = value.value;
  newValue = delta < 0 ? value.value + props.step : value.value - props.step;
  value.value = Math.max(props.min, Math.min(props.max, newValue));
};

</script>

<template>
  <p class="text-13px font-weight-user-defined">
    {{ prefix }}{{ value }}{{ suffix }}
  </p>
  <div
    class="slider py-3"
    @wheel.prevent="handleMouseScroll"
  >
    <slider
      v-model="value"
      v-bind="$attrs"
      :min="props.min"
      :max="props.max"
      show-tooltip="drag"
      tooltip-position="bottom"
      :step="step"
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