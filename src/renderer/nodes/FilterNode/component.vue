<script setup lang="ts">
import Slider from "@/components/input/BaseSlider.vue";
import CustomNode from "@/components/nodes/CustomNode.vue";
import { FilterIcon } from "@/icons/material";
import { percentToLog } from "@/logic/math";
import { watch } from "vue";
import { AmethystFilterNode } from ".";
const props = defineProps<{ node: AmethystFilterNode }>();

watch(() => props.node.frequencyPercent, percent => {
  props.node.frequency = percentToLog(percent, props.node.MIN_FREQUENCY, props.node.MAX_FREQUENCY);
});

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

</script>

<template>
  <CustomNode
    :node="node"
    title="12 dB/oct Filter"
    :icon="FilterIcon"
  >
    <p class="font-aseprite font-thin flex gap-2 items-center">
      <strong class="text-primary-900 ">Type</strong> 
      <select
        v-model="node.type"
        class="bg-surface-600 w-full font-aseprite font-thin py-2"
      >
        <option
          v-for="filterType of FILTER_TYPES"
          :key="filterType"
          class="text-10px"
          :value="filterType"
        >
          {{ filterType }}
        </option>
      </select>
    </p>

    <p class="font-aseprite font-thin">
      <strong class="text-primary-900 ">Frequency</strong>
      {{ Math.ceil(node.frequency) }} Hz <span class="text-primary-900 text-opacity-50">{{ node.frequencyPercent }}
        %</span>
    </p>
    <Slider
      v-model="node.frequencyPercent"
      max="100"
      @mousedown.stop
    />

    <p class="font-aseprite font-thin">
      <strong class="text-primary-900 ">Quality Factor (Q)</strong> {{
        node.Q
      }}
    </p>
    <Slider
      v-model="node.Q"
      :min="-10"
      :max="10"
      @mousedown.stop
    />
    <p class="font-aseprite font-thin">
      <strong class="text-primary-900 ">Gain</strong> {{
        node.gain.toFixed(2)
      }} dB
    </p>
    <Slider
      v-model="node.gain"
      :min="-24"
      :max="24"
      step="0.01"
      @mousedown.stop
    />
  </CustomNode>
</template>
