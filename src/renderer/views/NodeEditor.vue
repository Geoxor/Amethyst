<script setup lang="ts">
import { usePlayer, useState } from "@/amethyst";
import SquareButton from "@/components/input/SquareButton.vue";
import { AdjustIcon, AzimuthIcon, FilterIcon, WaveIcon } from "@/icons/material";
import {MagnetIcon} from "@/icons/plumpy";
import { AmethystEqualizerNode, AmethystGainNode, AmethystPannerNode, AmethystSpectrumNode } from "@/logic/audio";
import { getThemeColorHex } from "@/logic/color";
import { Background, BackgroundVariant } from "@vue-flow/additional-components";
import { NodeDragEvent, VueFlow } from "@vue-flow/core";
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

const getDashCoords = () => {
  const transformationPane = document.getElementsByClassName("vue-flow__transformationpane")[0]! as HTMLDivElement;
  const style = getComputedStyle(transformationPane);
  const matrix = style.transform;

  // No transform property. Simply return 0 values.
  if (matrix === "none" || typeof matrix === "undefined") {
    return {
      x: 0,
      y: 0,
      z: 0
    };
  }

  // Can either be 2d or 3d transform
  const matrixType = matrix.includes("3d") ? "3d" : "2d";
  const matrixValues = matrix.match(/matrix.*\((.+)\)/)?.[1].split(", ");

  // 2d matrices have 6 values
  // Last 2 values are X and Y.
  // 2d matrices does not have Z value.
  if (matrixType === "2d") {
    return {
      x: parseFloat(matrixValues![4]),
      y: parseFloat(matrixValues![5]),
      z: 0
    };
  }

  // 3d matrices have 16 values
  // The 13th, 14th, and 15th values are X, Y, and Z
  if (matrixType === "3d") {
    return {
      x: parseFloat(matrixValues![12]),
      y: parseFloat(matrixValues![13]),
      z: parseFloat(matrixValues![14]),
    };
  }

  return {
    x: 0,
    y: 0,
    z: 0
  };
};

const computeNodePosition = (x: number, y: number) => {
  const {x: dashX, y: dashY} = getDashCoords();
  return { x: -dashX + x , y: -dashY + y };
};

const handleContextMenu = ({y, x}: MouseEvent) => {
  state.openContextMenuAt(x, y, [
    {title: "Add AmethystEqualizerNode", icon: FilterIcon, action: () => {
      player.nodeManager.addNode(new AmethystEqualizerNode(player.nodeManager.context, "filter", computeNodePosition(x, y)));
    }},
    {title: "Add AmethystPannerNode", icon: AzimuthIcon, action: () => {
      player.nodeManager.addNode(new AmethystPannerNode(player.nodeManager.context, "panner", computeNodePosition(x, y)));
    }},
    {title: "Add AmethystGainNode", icon: AdjustIcon, action: () => {
      player.nodeManager.addNode(new AmethystGainNode(player.nodeManager.context, "gain", computeNodePosition(x, y)));
    }},
    {title: "Add AmethystSpectrumNode", icon: WaveIcon, action: () => {
      player.nodeManager.addNode(new AmethystSpectrumNode(player.nodeManager.context, "spectrum", computeNodePosition(x, y)));
    }},
  ]);
};

const handleNodeDragStop = (e: NodeDragEvent) => {
  player.nodeManager.nodes.find(node => node.properties.id === e.node.id)?.updatePosition(e.node.position);
};

</script>

<template>
  <div
    ref="nodeEditor"
    class="flex-1 h-full w-full borderRight flex flex-col relative"
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
      :max-zoom="6.00"
      :connection-line-style="{ stroke: getThemeColorHex('--primary-700') }"
      :fit-view-on-init="true"
      :default-edge-options="{ type: 'smoothstep' }"
      @node-drag-stop="handleNodeDragStop"
      @contextmenu="handleContextMenu"
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