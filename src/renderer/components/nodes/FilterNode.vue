<script setup lang="ts">
import Slider from "@/components/input/BaseSlider.vue";
import CustomNode from "@/components/nodes/CustomNode.vue";
import {FilterIcon} from "@/icons/material";
import { AmethystEqualizerNode } from "@/logic/audio";
import { computed, ref, watch } from "vue";

const props = defineProps<{ node: AmethystEqualizerNode }>();
const frequency = ref(100);
const Q = ref(props.node.node.Q.value);
const frequencyLog = computed(() => logSlider(frequency.value));

// Update the nodes with the component's value
watch(() => frequency.value, value => props.node.node.frequency.value = logSlider(value));
watch(() => Q.value, value => props.node.node.Q.value = value);

const logSlider = (position: number) => {
  const minp = 0;
  const maxp = 100;

  const minv = Math.log(20);
  const maxv = Math.log(22500);

  // calculate adjustment factor
  const scale = (maxv - minv) / (maxp - minp);

  return Math.exp(minv + scale * (position - minp)) + .1;
};

</script>

<template>
  <CustomNode
    :node="node"
    title="Lowpass Filter"
    :icon="FilterIcon"
  >
    <p class="font-aseprite">
      <strong class="text-primary-900 font-aseprite font-thin">Frequency</strong> {{
        ~~frequencyLog
      }}
      Hz
    </p>
    <Slider
      v-model="frequency"
      max="100"
      @mousedown.stop
    />

    <p class="font-aseprite">
      <strong class="text-primary-900 font-aseprite font-thin">Quality Factor (Q)</strong> {{
        Q
      }}
    </p>
    <Slider
      v-model="Q"
      :min="-10"
      :max="10"
      @mousedown.stop
    />
  </CustomNode>
</template>
