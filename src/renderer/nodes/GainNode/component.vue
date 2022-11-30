<script setup lang="ts">
import Slider from "@/components/input/BaseSlider.vue";
import CustomNode from "@/components/nodes/CustomNode.vue";
import {AdjustIcon} from "@/icons/material";
import { AmethystGainNode } from ".";
import { ref, watch } from "vue";
const props = defineProps<{ node: AmethystGainNode }>();
const gain = ref(props.node.audioNode.gain.value);
watch(() => gain.value, () => props.node.audioNode.gain.value = gain.value);
</script>

<template>
  <CustomNode
    :node="node"
    title="Gain"
    :icon="AdjustIcon"
  >
    <p class="font-aseprite">
      {{ ~~(gain * 100) }} %
    </p>
    <Slider
      v-model="gain"
      step="0.01"
      max="3"
      min="0"
      @mousedown.stop
    />
  </CustomNode>
</template>
