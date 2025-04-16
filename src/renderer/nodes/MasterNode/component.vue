<script setup lang="ts">
import CustomNode from "@/components/nodes/CustomNode.vue";
import { AmethystAudioNode } from "@/logic/audio";
defineProps<{ node: AmethystAudioNode }>();

</script>

<template>
  <CustomNode
    meterless
    :node="node"
    title="Master"
    description="To Outputs"
    icon="ic:twotone-mediation"
  />
</template>
