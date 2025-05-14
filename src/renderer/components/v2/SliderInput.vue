<script setup lang="ts">
import Slider from "@vueform/slider";
import { useVModel } from "@vueuse/core";

import BaseChip from "../BaseChip.vue";

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
  <base-chip color="accent">
    <p class="text-11px font-weight-user-defined">
      <span class="opacity-75">{{ prefix }}</span> {{ value }} <span class="opacity-75">{{ suffix }}</span>
    </p>
  </base-chip>
  <div
    class="slider py-3 max-w-160px"
    @wheel.prevent="handleMouseScroll"
  >
    <slider
      v-model="value"
      v-bind="$attrs"
      :min="min"
      :max="max"
      :step="step"
      :format="(v: number) => v.toFixed(2)"
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
  --slider-tooltip-bg: rgba(var(--accent));
  --slider-focus-bg: rgba(var(--accent));
  --slider-handle-ring-color: rgba(var(--accent), 0.25);
}

.slider-connect {
  @apply bg-accent/50;
}

.slider-handle {
  @apply bg-accent;
}

.slider-base {
  @apply bg-accent/15;
}

.slider-tooltip {
  @apply bg-accent border-none;
}

</style>