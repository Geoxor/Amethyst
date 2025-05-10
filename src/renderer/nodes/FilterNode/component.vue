<script setup lang="ts">
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

</script>

<template>
  <custom-node
    :node="node"
    :title="$t('node.filter.title')"
  >
    <div class="font-aseprite font-thin flex gap-2 items-center">
      <p class="text-primary-900 ">
        Type
      </p>
      <div class="flex rounded-[2px] overflow-hidden">
        <button
          v-for="filterType of node.getParameters().type.options"
          :key="filterType"
          class="text-[11px] cursor-pointer px-1 py-0.5 bg-surface-900"
          :class="[node.type == filterType ? 'text-accent bg-accent/10' : 'text-surface-500']"
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
  </custom-node>
</template>
