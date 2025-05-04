<script setup lang="ts">
import CustomNode from "@/components/nodes/CustomNode.vue";
import type { AmethystAudioNode } from "@/logic/audio";
defineProps<{ node: AmethystAudioNode }>();

</script>

<template>
  <custom-node
    meterless
    :node="node"
    :title="$t('node.master.title')"
    :description="$t('node.master.description')"
  />
</template>
