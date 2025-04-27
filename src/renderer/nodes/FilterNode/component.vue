<script setup lang="ts">
import Slider from "@/components/input/BaseSlider.vue";
import CustomNode from "@/components/nodes/CustomNode.vue";
import { percentToLogValue } from "@/logic/math";
import { watch } from "vue";
import type { AmethystFilterNode } from ".";

import BandpassIcon from "@/icons/equalizer/BandpassIcon.vue";
import HighpassIcon from "@/icons/equalizer/HighpassIcon.vue";
import HighShelfIcon from "@/icons/equalizer/HighShelfIcon.vue";
import LowpassIcon from "@/icons/equalizer/LowpassIcon.vue";
import LowShelfIcon from "@/icons/equalizer/LowShelfIcon.vue";
import PeakIcon from "@/icons/equalizer/PeakIcon.vue";

const props = defineProps<{ node: AmethystFilterNode }>();

watch(() => props.node.frequencyPercent, percent => {
  props.node.frequency = percentToLogValue(percent, props.node.MIN_FREQUENCY, props.node.MAX_FREQUENCY);
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
  <custom-node
    :node="node"
    title="12 dB/oct Filter"
    icon="ic:twotone-filter-list"
  >
    <div class="font-aseprite font-thin flex gap-2 items-center">
      <p class="text-primary-900 ">
        Type
      </p>
      <div class="flex rounded-2px overflow-hidden">
        <button
          v-for="filterType of FILTER_TYPES"
          :key="filterType"
          class="text-11px cursor-pointer px-1 py-0.5 bg-surface-900"
          :class="[node.type == filterType ? 'text-accent bg-accent bg-opacity-10' : 'text-surface-500']"
          @mousedown.stop
          @click="node.type = filterType"
        >
          <high-shelf-icon
            v-if="filterType == 'highshelf'"
            class="h-4 w-4"
          />
          <low-shelf-icon
            v-else-if="filterType == 'lowshelf'"
            class="h-4 w-4"
          />
          <lowpass-icon
            v-else-if="filterType == 'lowpass'"
            class="h-4 w-4"
          />
          <highpass-icon
            v-else-if="filterType == 'highpass'"
            class="h-4 w-4"
          />
          <peak-icon
            v-else-if="filterType == 'peaking'"
            class="h-4 w-4"
          />
          <bandpass-icon
            v-else-if="filterType == 'bandpass'"
            class="h-4 w-4"
          />
        </button>
      </div>
    </div>

    <p class="font-aseprite font-thin">
      <strong class="text-primary-900 ">Frequency</strong>
      {{ Math.ceil(node.frequency) }} Hz <span class="text-primary-900 text-opacity-50">{{ Math.ceil(node.frequencyPercent) }}
        %</span>
    </p>
    <slider
      v-model="node.frequencyPercent"
      max="100"
      class="h-1.5"
      @mousedown.stop
    />

    <p class="font-aseprite font-thin">
      <strong class="text-primary-900 ">Quality Factor (Q)</strong> {{
        node.Q
      }}
    </p>
    <slider
      v-model="node.Q"
      :min="-10"
      :max="10"
      class="h-1.5"
      @mousedown.stop
    />
    <p class="font-aseprite font-thin">
      <strong class="text-primary-900 ">Gain</strong> {{
        node.gain.toFixed(2)
      }} dB
    </p>
    <slider
      v-model="node.gain"
      :min="-24"
      :max="24"
      class="h-1.5"
      step="0.01"
      @mousedown.stop
    />
  </custom-node>
</template>
