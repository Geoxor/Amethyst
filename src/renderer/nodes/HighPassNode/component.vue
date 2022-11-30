<script setup lang="ts">
import Slider from "@/components/input/BaseSlider.vue";
import CustomNode from "@/components/nodes/CustomNode.vue";
import {FilterIcon} from "@/icons/material";
import { AmethystHighPassNode } from ".";
import { percentToLog } from "@/logic/math";
import { computed, ref, watch } from "vue";

const props = defineProps<{ node: AmethystHighPassNode }>();
const frequency = ref(0);
const Q = ref(props.node.audioNode.Q.value);
const frequencyLog = computed(() => percentToLog(frequency.value, 20, 22050));

// Update the nodes with the component's value
watch(() => frequency.value, value => props.node.audioNode.frequency.value = percentToLog(value, 20, 22050));
watch(() => Q.value, value => props.node.audioNode.Q.value = value);

</script>

<template>
  <CustomNode
    :node="node"
    title="Highpass Filter"
    :icon="FilterIcon"
  >
    <p class="font-aseprite">
      <strong class="text-primary-900 font-aseprite font-thin">Frequency</strong> {{
        Math.ceil(frequencyLog)
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
