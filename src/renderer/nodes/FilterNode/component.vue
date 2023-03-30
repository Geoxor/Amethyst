<script setup lang="ts">
import Slider from "@/components/input/BaseSlider.vue";
import CustomNode from "@/components/nodes/CustomNode.vue";
import { FilterIcon,

HighShelfIcon,
LowShelfIcon,
LowpassIcon,
HighpassIcon,
BellIcon,
BandpassIcon,

} from "@/icons/material";
import { percentToLog } from "@/logic/math";
import { watch } from "vue";
import { AmethystFilterNode } from ".";
const props = defineProps<{ node: AmethystFilterNode }>();

watch(() => props.node.frequencyPercent, percent => {
  props.node.frequency = percentToLog(percent, props.node.MIN_FREQUENCY, props.node.MAX_FREQUENCY);
});

const FILTER_TYPES = [
  // "allpass",
  "lowshelf",
  "lowpass",
  "bandpass",
  // "notch",
  "peaking",
  "highpass",
  "highshelf",
];

</script>

<template>
  <CustomNode
    :node="node"
    title="12 dB/oct Filter"
    :icon="FilterIcon"
  >
    <div class="font-aseprite font-thin flex gap-2 items-center">
      <p class="text-primary-900 ">
        Type
      </p>
      <div class="flex rounded-2px overflow-hidden">
        <button
          v-for="filterType of FILTER_TYPES"
          :key="filterType"
          class="text-10px cursor-pointer px-1 py-0.5 bg-surface-900"
          :class="[node.type == filterType ? 'text-primary-800 bg-primary-800 bg-opacity-10' : 'text-surface-500']"
          @mousedown.stop
          @click="node.type = filterType"
        >
          <HighShelfIcon
            v-if="filterType == 'highshelf'"
            class="h-4 w-4"
          />
          <LowShelfIcon
            v-else-if="filterType == 'lowshelf'"
            class="h-4 w-4"
          />
          <LowpassIcon
            v-else-if="filterType == 'lowpass'"
            class="h-4 w-4"
          />
          <HighpassIcon
            v-else-if="filterType == 'highpass'"
            class="h-4 w-4"
          />
          <BellIcon
            v-else-if="filterType == 'peaking'"
            class="h-4 w-4"
          />
          <BandpassIcon
            v-else-if="filterType == 'bandpass'"
            class="h-4 w-4"
          />
        </button>
      </div>
    </div>

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
