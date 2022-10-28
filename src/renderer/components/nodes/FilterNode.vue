<script setup lang="ts">
import Slider from "@/components/input/BaseSlider.vue";
import CustomNode from "@/components/nodes/CustomNode.vue";
import FilterIcon from "@/icons/material/FilterIcon.vue";
import { AmethystEqualizerNode } from "@/logic/audio";
import { ref, watch } from "vue";

const props = defineProps<{ node: AmethystEqualizerNode }>();
const gain = ref(props.node.node.gain.value);
watch(() => gain.value, () => props.node.node.gain.value = gain.value);

const frequency = ref(props.node.node.frequency.value);
watch(() => frequency.value, () => props.node.node.frequency.value = frequency.value);

</script>

<template>
  <CustomNode
    :node="node"
    title="Single Band Filter"
    :icon="FilterIcon"
  >
    <p class="font-aseprite">
      <strong class="text-white font-aseprite font-thin text-opacity-50">Gain</strong> {{ gain }}
      dB
    </p>

    <Slider
      v-model="gain"
      min="-18"
      max="18"
      @mousedown.stop
    />

    <p class="font-aseprite">
      <strong class="text-white font-aseprite font-thin text-opacity-50">Frequency</strong> {{
        frequency
      }}
      Hz
    </p>
    <Slider
      v-model="frequency"
      max="2000"
      @mousedown.stop
    />
  </CustomNode>
</template>
