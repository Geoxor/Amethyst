<script setup lang="ts">
import { usePlayer, useState } from "@/amethyst";
import SquareButton from "@/components/input/SquareButton.vue";
import MagnetIcon from "@/icons/plumpy/MagnetIcon.vue";
import { getThemeColorHex } from "@/logic/color";
import { Background, BackgroundVariant } from "@vue-flow/additional-components";
import { VueFlow } from "@vue-flow/core";
import { computed, onMounted, ref } from "vue";
const dash = ref();
const nodeEditor = ref();

onMounted(() => {
  new ResizeObserver(dash.value.fitView).observe(nodeEditor.value);
});

const player = usePlayer();
const state = useState();
const elements = computed(() => [...player.nodeManager.getNodeProperties(), ...player.nodeManager.getNodeConnections()]);

const handleClick = () => {
  state.settings.isSnappingToGrid = !state.settings.isSnappingToGrid;
};

</script>

<template>
  <div
    ref="nodeEditor"
    class="flex-1 h-full borderRight flex flex-col relative"
  >
    <SquareButton
      class="absolute bottom-2 right-2 z-10 "
      :icon="MagnetIcon"
      :active="state.settings.isSnappingToGrid"
      @click="handleClick"
    />

    <VueFlow
      ref="dash"
      v-model="elements"
      class="bg-black bg-opacity-25 p-2"
      :snap-to-grid="state.settings.isSnappingToGrid"
      :max-zoom="1.25"
      :connection-line-style="{ stroke: getThemeColorHex('--primary-700') }"
      :fit-view-on-init="true"
      :default-edge-options="{ type: 'smoothstep' }"
    >
      <Background
        :size="0.5"
        :variant="BackgroundVariant.Dots"
        :pattern-color="getThemeColorHex('--surface-500')"
      />

      <template
        v-for="node of player.nodeManager.nodes"
        :key="node.properties.id"
        #[node.getSlotName()]
      >
        <component
          :is="node.component"
          :node="node"
        />
      </template>
    </VueFlow>
  </div>
</template>

<style>
.magnet:hover {
  @apply bg-surface-500;
}

.magnet.active {
  @apply bg-cyan-400 text-surface-900;
}

.magnet.active:hover {
  @apply bg-cyan-300 text-surface-900;
}

/* we will explain what these classes do next! */
.v-enter-active {
  transition: opacity 1ms linear;
}
.v-leave-active {
  transition: opacity 300ms linear;
}

.v-enter-from {
  opacity: 100;
}

.v-leave-to {
  opacity: 0;
}
</style>