<script setup lang="ts">
import CustomNode from "@/components/nodes/CustomNode.vue";
import EqualizerBand from "./EqualizerBand.vue";
import { FilterIcon } from "@/icons/material";
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

const handleChange = (idx: number, event: Event, key: string) => {
  const filter = props.node.filters[idx];

  switch(key) {
    case "gain":
      filter.gain.value = parseFloat((event.target as HTMLInputElement).value);
      break;
    case "type":
      filter.type = (event.target as HTMLInputElement).value as BiquadFilterType;
      break;
  }
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
        class="div flex flex-col gap-1 h-min  font-aseprite"
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
          :min="0"
          :max="10"
          :step="0.01"
          suffix="Q"
          :digits="2"
        />
        
        <select
          v-model="filter.type"
          class="bg-surface-600 w-full font-aseprite font-thin py-2"
          @change="handleChange(i, $event, 'type')"
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
      </div>
    </div>
  </CustomNode>
</template>
