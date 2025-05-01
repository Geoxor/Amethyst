<script setup lang="ts">
import DraggableModifierInput from "@/components/input/DraggableModifierInput.vue";
import CustomNode from "@/components/nodes/CustomNode.vue";
import type { AmethystGainNode } from ".";
defineProps<{ node: AmethystGainNode }>();
</script>

<template>
  <custom-node
    :node="node"
    title="Gain"
  >
    <draggable-modifier-input 
      v-model="node.gain"
      :step="node.getParameters().gain.step"
      :max="node.getParameters().gain.max"
      :min="node.getParameters().gain.min"
      :suffix="node.getParameters().gain.unit"
      :default="node.getParameters().gain.default"
    />
  </custom-node>
</template>
