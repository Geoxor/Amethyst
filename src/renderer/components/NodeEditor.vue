<script setup lang="ts">
import { usePlayer, useState } from '@/amethyst';
import SquareButton from '@/components/input/SquareButton.vue';
import MagnetIcon from '@/icons/plumpy/MagnetIcon.vue';
import { getThemeColorHex } from '@/logic/color';
import { Background, BackgroundVariant } from '@vue-flow/additional-components';
import { VueFlow } from '@vue-flow/core';
import { computed, onMounted, ref } from 'vue';
const dash = ref();
const nodeEditor = ref();

// Fit to view again when resizing
onMounted(() => {
  window.addEventListener('resize', () => dash.value.fitView());
});

const player = usePlayer();
const state = useState();
const elements = computed(() => [...player.nodeManager.getNodeProperties(), ...player.nodeManager.getNodeConnections()]);

</script>

<template>
  <div ref="nodeEditor" class="w-full h-full flex flex-col borderLeft relative">
    <SquareButton class="absolute bottom-2 right-2 z-10 " :icon="MagnetIcon" :active="state.settings.isSnappingToGrid"
      @click="state.settings.isSnappingToGrid = !state.settings.isSnappingToGrid" />

    <VueFlow ref="dash" class="bg-black bg-opacity-25 p-2" :snap-to-grid="state.settings.isSnappingToGrid"
      :max-zoom="1.25" v-model="elements" :connection-line-style="{ stroke: getThemeColorHex('--primary-800') }"
      :fit-view-on-init="true" :default-edge-options="{ type: 'smoothstep' }">

      <Background :size="0.5" :variant="BackgroundVariant.Dots" :pattern-color="getThemeColorHex('--surface-500')" />

      <template v-for="node of player.nodeManager.nodes" :key="node.properties.id" v-slot:[node.getSlotName()]>
        <component :is="node.component" :node="node" />
      </template>

    </VueFlow>
    <!-- <h1>test</h1> -->
  </div>
</template>

<style>
.magnet:hover {
  @apply bg-cyan-300 text-surface-900;
}

.magnet.active {
  @apply bg-cyan-400 text-surface-900;
}

.magnet.active:hover {
  @apply bg-cyan-500 text-surface-900;
}
</style>