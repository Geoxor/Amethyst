<script setup lang="ts">
import CustomNode from "@/components/nodes/CustomNode.vue";

import type { AmethystOutputNode } from ".";
defineProps<{ node: AmethystOutputNode }>();

</script>

<template>
  <custom-node
    meterless
    :node="node"
    :title="$t('node.output.title')"
    :description="$t('node.output.description')"
  />
</template>
