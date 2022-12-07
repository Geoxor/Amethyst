<script setup lang="ts">
import CustomNode from "@/components/nodes/CustomNode.vue";
import {StepIntoIcon} from "@/icons/material";
import { AmethystInputNode } from ".";
defineProps<{ node: AmethystInputNode }>();

</script>

<template>
  <CustomNode
    :node="node"
    title="Input"
    description="From Amethyst"
    :icon="StepIntoIcon"
  />
</template>