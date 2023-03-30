<script setup lang="ts">
import CustomNode from "@/components/nodes/CustomNode.vue";
import EqualizerBand from "./EqualizerBand.vue";
import { AmethystEightBandEqualiserNode } from ".";
import { FilterIcon,

HighShelfIcon,
LowShelfIcon,
LowpassIcon,
HighpassIcon,
BellIcon,
BandpassIcon,

} from "@/icons/material";
import { ref } from "vue";
const props = defineProps<{ node: AmethystEightBandEqualiserNode }>();

// watch(() => props.node.frequencyPercent, percent => {
//   props.node.frequency = percentToLog(percent, props.node.MIN_FREQUENCY, props.node.MAX_FREQUENCY);
// });

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

const componentKey = ref(0);

// hack to get it to refresh
const forceRerender = () => {
  componentKey.value += 1;
};

</script>

<template>
  <CustomNode
    :node="node"
    title="8-Band Equaliser"
    :icon="FilterIcon"
  >
    <div
      :key="componentKey" 
      class="grid grid-cols-4 gap-2 text-primary-900"
    >
      <div
        v-for="(filter, i) of node.filters"
        :key="i"
        class="div flex flex-col h-min w-min font-aseprite bg-surface-1000 p-2 rounded-4px gap-2"
        @mousedown.stop
      >
        <equalizer-band
          v-model="filter.frequency.value"
          :param="filter.frequency"
          :min="0.01"
          log
          :max="22050"
          :step="0.01"
          :digits="0"
          suffix="Hz"
        />
        <equalizer-band
          v-model="filter.gain.value"
          :param="filter.gain"
          :min="-24"
          :max="+24"
          :step="0.01"
          :digits="2"
          suffix="dB"
        />
        <equalizer-band
          v-model="filter.Q.value"
          :param="filter.Q"
          log
          :min="0.01"
          :max="10"
          :step="0.01"
          suffix="Q"
          :digits="2"
        />
        <div class="flex rounded-2px overflow-hidden">
          <button
            v-for="filterType of FILTER_TYPES"
            :key="filterType"
            class="text-10px cursor-pointer px-1 py-0.5 bg-surface-900"
            :class="[filter.type == filterType ? 'text-primary-800 bg-primary-800 bg-opacity-10' : 'text-surface-500']"
            @mousedown.stop
            @click="filter.type = filterType; forceRerender()"
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
    </div>
  </CustomNode>
</template>
