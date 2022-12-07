<script setup lang="ts">
import Slider from "@/components/input/BaseSlider.vue";
import CustomNode from "@/components/nodes/CustomNode.vue";
import {AdjustIcon} from "@/icons/material";
import { AmethystGainNode } from ".";
defineProps<{ node: AmethystGainNode }>();
</script>

<template>
  <CustomNode
    :node="node"
    title="Gain"
    :icon="AdjustIcon"
  >
    <p class="font-aseprite">
      {{ (20 * Math.log10( node.gain)).toFixed(2) }} dB
    </p>
    <Slider
      v-model="node.gain"
      step="0.01"
      max="3"
      min="0"
      @mousedown.stop
    />
  </CustomNode>
</template>
