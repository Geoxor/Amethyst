<script setup lang="ts">
import CustomNode from "@/components/nodes/CustomNode.vue";
import {StepIntoIcon} from "@/icons/material";
import { AmethystAudioNode } from "@/logic/audio";
defineProps<{ node: AmethystAudioNode<any> }>();

</script>

<template>
  <CustomNode
    :node="node"
    title="Input"
    description="From Amethyst"
    :icon="StepIntoIcon"
  />
</template>
