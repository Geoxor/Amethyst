<script setup lang="ts">
import CustomNode from "@/components/nodes/CustomNode.vue";
import { AmethystInputNode } from ".";
defineProps<{ node: AmethystInputNode }>();

</script>

<template>
  <CustomNode
    :node="node"
    title="Input"
    description="From Amethyst"
    icon="ic:twotone-input"
  />
</template>