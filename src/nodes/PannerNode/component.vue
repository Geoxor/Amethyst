<script setup lang="ts">
import CustomNode from "@/components/nodes/CustomNode.vue";

import type { AmethystPannerNode } from ".";
import Graphics from "./PannerGraphics.vue";
defineProps<{ node: AmethystPannerNode }>();
</script>

<template>
  <custom-node
    :node="node"
    :title="$t('node.panner.title')"
  >
    <graphics :pan="node.pan" />
  </custom-node>
</template>
