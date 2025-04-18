<script setup lang="ts">
import Slider from "@/components/input/BaseSlider.vue";
import CustomNode from "@/components/nodes/CustomNode.vue";
import { AmethystGainNode } from ".";
defineProps<{ node: AmethystGainNode }>();
</script>

<template>
  <custom-node
    :node="node"
    title="Gain"
    icon="ic:twotone-volume-up"
  >
    <p class="font-aseprite">
      {{ (20 * Math.log10( node.gain)).toFixed(2) }} dB
    </p>
    <slider
      v-model="node.gain"
      step="0.01"
      max="3"
      class="h-1.5"
      min="0"
      @mousedown.stop
    />
  </custom-node>
</template>
