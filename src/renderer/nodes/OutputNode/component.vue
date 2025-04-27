<script setup lang="ts">
import CustomNode from "@/components/nodes/CustomNode.vue";
import type { AmethystOutputNode } from ".";
defineProps<{ node: AmethystOutputNode }>();

</script>

<template>
  <custom-node
    meterless
    :node="node"
    title="Output"
    description="To Speakers"
    icon="ic:twotone-output"
  />
</template>
