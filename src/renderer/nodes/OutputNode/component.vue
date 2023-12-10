<script setup lang="ts">
import CustomNode from "@/components/nodes/CustomNode.vue";
import {AmethystIcon} from "@/icons";
import { AmethystOutputNode } from ".";
defineProps<{ node: AmethystOutputNode }>();

</script>

<template>
  <CustomNode
    meterless
    :node="node"
    title="Output"
    description="To Speakers"
    :icon="AmethystIcon"
  />
</template>
