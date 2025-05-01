<script setup lang="ts">
import DraggableModifierInput from "@/components/input/DraggableModifierInput.vue";
import CustomNode from "@/components/nodes/CustomNode.vue";
import type { AmethystPannerNode } from ".";
defineProps<{ node: AmethystPannerNode }>();

</script>

<template>
  <custom-node
    :node="node"
    title="Stereo Panner"
  >
    <draggable-modifier-input 
      v-model="node.pan"
      :step="0.25"
      :max="node.getParameters().pan.max"
      :min="node.getParameters().pan.min"
      :suffix="node.getParameters().pan.unit"
      :default="node.getParameters().pan.default"
    />
  </custom-node>
</template>
