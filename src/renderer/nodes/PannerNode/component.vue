<script setup lang="ts">
import Slider from "@/components/input/BaseSlider.vue";
import CustomNode from "@/components/nodes/CustomNode.vue";
import { AmethystPannerNode } from ".";
defineProps<{ node: AmethystPannerNode }>();
function clamp(input: number, min: number, max: number): number {
  return input < min ? min : input > max ? max : input;
}
function map(current: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
  const mapped: number = ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  return clamp(mapped, out_min, out_max);
}
</script>

<template>
  <custom-node
    :node="node"
    title="Stereo Panner"
    icon="ic:twotone-fiber-smart-record"
  >
    <p class="font-aseprite">
      {{ map(node.pan, -1, 1,-180, 180).toFixed(2) }}°
    </p>
    <slider
      v-model="node.pan"
      step="0.001"
      max="1"
      min="-1"
      class="h-1.5"
      @mousedown.stop
    />
  </custom-node>
</template>
