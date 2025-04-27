<script setup lang="ts">
import CustomNode from "@/components/nodes/CustomNode.vue";
import type { AmethystInputNode } from ".";
defineProps<{ node: AmethystInputNode }>();

</script>

<template>
  <custom-node
    :node="node"
    title="Input"
    description="From Amethyst"
    icon="ic:twotone-input"
  />
</template>