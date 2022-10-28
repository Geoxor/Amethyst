<script setup lang="ts">
import CustomNode from "@/components/nodes/CustomNode.vue";
import StepOutIcon from "@/icons/material/StepOutIcon.vue";
import { AmethystAudioNode } from "@/logic/audio";
defineProps<{ node: AmethystAudioNode<any> }>();

</script>

<template>
  <CustomNode
    meterless
    :node="node"
    title="Output"
    description="To Speakers"
    :icon="StepOutIcon"
  />
</template>
