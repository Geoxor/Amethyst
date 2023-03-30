<script setup lang="ts">
import Slider from "@/components/input/BaseSlider.vue";
import CustomNode from "@/components/nodes/CustomNode.vue";
import { FilterIcon } from "@/icons/material";
import { percentToLog } from "@/logic/math";
import { watch } from "vue";
import { AmethystEightBandEqualiserNode } from ".";
const props = defineProps<{ node: AmethystEightBandEqualiserNode }>();

// watch(() => props.node.frequencyPercent, percent => {
//   props.node.frequency = percentToLog(percent, props.node.MIN_FREQUENCY, props.node.MAX_FREQUENCY);
// });

const FILTER_TYPES = [
  "allpass",
   "bandpass",
   "highpass",
   "highshelf",
   "lowpass",
   "lowshelf",
   "notch",
   "peaking"
];

const handleChange = (idx: number, event: Event) => {
  const filter = props.node.filters[idx];
  filter.gain.value = parseFloat((event.target as HTMLInputElement).value);

  console.log(`setting filter gain to: ${parseFloat((event.target as HTMLInputElement).value)}`);
  
};

</script>

<template>
  <CustomNode
    :node="node"
    title="8-Band Equaliser"
    :icon="FilterIcon"
  >
    <div class="flex gap-2 text-primary-900">
      <div
        v-for="(filter, i) of node.filters"
        :key="i"
        class="div flex flex-col h-40 items-center font-aseprite"
      >
        <div class="relative flex-1 h-full w-full">
          <Slider
            v-model="filter.gain.value"
            :min="-24"
            :max="24"
            step="0.01"
            vertical
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform-gpu -rotate-90 flex-1 h-full"
            @mousedown.stop
            @change="handleChange(i, $event)"
          />
        </div>
        <p>Freq: {{ filter.frequency.value.toFixed(0) }}</p>
        <p>Q: {{ filter.Q.value.toFixed(2) }}</p>
        <p>Gain: {{ filter.gain.value.toFixed(2) }}</p>
      </div>
    </div>
  </CustomNode>
</template>
