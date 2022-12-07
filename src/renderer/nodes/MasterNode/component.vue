<script setup lang="ts">
import CustomNode from "@/components/nodes/CustomNode.vue";
import {MasterIcon} from "@/icons/material";
import { AmethystAudioNode } from "@/logic/audio";
defineProps<{ node: AmethystAudioNode<any> }>();

</script>

<template>
  <CustomNode
    meterless
    :node="node"
    title="Master"
    description="To Outputs"
    :icon="MasterIcon"
  />
</template>
