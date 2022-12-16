<script setup lang="ts">
import { onMounted, ref } from "vue";
import "weq8/ui"; // or "https://cdn.skypack.dev/weq8/ui"
import { AmethystParametricEqualizerNode, weq8 } from ".";
import { FilterIcon } from "@/icons/material";
import CustomNode from "@/components/nodes/CustomNode.vue";
const eq = ref();
onMounted(() => {
  eq.value.runtime = weq8;
});
defineProps<{ node: AmethystParametricEqualizerNode }>();

</script>

<template>
  <CustomNode
    meterless
    :node="node"
    title="WEQ8"
    :icon="FilterIcon"
  >
    <weq8-ui
      ref="eq"
      class=""
    />
  </CustomNode>
</template>

<style  lang="postcss">
weq8-ui {
  min-width: 1000px;
  min-height: 200px;
  @apply bg-surface-900 p-2 border-none overflow-hidden rounded-4px gap-2 flex flex-row;
}
weq8-ui-filter-row {
  &.selected {
    @apply bg-surface-800;
  }
}
weq8-ui,
weq8-ui-filter-row * {
  font-family: "aseprite" !important;
  @apply text-7px;
}
</style>
