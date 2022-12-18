<script setup lang="ts">
import { useState, useFs } from "@/amethyst";
import SquareButton from "@/components/input/SquareButton.vue";
import { MagnetIcon, SaveIcon, AdjustIcon, AzimuthIcon, FilterIcon, SelectNoneIcon, WaveIcon, RemoveIcon, LoadingIcon, ResetIcon } from "@/icons/material";
import { getThemeColorHex } from "@/logic/color";
import { Background, BackgroundVariant } from "@vue-flow/additional-components";
import { Connection, EdgeMouseEvent, NodeDragEvent, VueFlow } from "@vue-flow/core";
import { onKeyStroke } from "@vueuse/core";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { player } from "@/logic/player";
import { AmethystPannerNode, AmethystGainNode, AmethystSpectrumNode, AmethystFilterNode } from "@/nodes";
import { AmethystAudioNode } from "@/logic/audio";
import { Coords } from "@shared/types";
import { useContextMenu } from "@/components/ContextMenu";

const dash = ref();
const nodeEditor = ref();
const fs = useFs();
type NodeMenuOptions = Coords & {source?: AmethystAudioNode<AudioNode>, target?: AmethystAudioNode<AudioNode>};

let resizeObserver: ResizeObserver;

onMounted(() => {
  resizeObserver = new ResizeObserver(fitToView);
  resizeObserver.observe(nodeEditor.value);
}); 

onUnmounted(() => {
  resizeObserver.disconnect();
});

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

const computeNodePosition = ({x, y}: Coords) => {
  const {x: dashX, y: dashY} = getDashCoords();
  return { x: -dashX + x , y: -dashY + y };
};

const nodeMenu = ({x, y, source, target}: NodeMenuOptions) => [
  {title: "Add FilterNode", icon: FilterIcon, action: () => {
    player.nodeManager.addNode(new AmethystFilterNode(player.nodeManager.context, computeNodePosition({x, y})), source && target && [source, target]);
  }},
  {title: "Add PannerNode", icon: AzimuthIcon, action: () => {
    player.nodeManager.addNode(new AmethystPannerNode(player.nodeManager.context, computeNodePosition({x, y})), source && target && [source, target]);
  }},
  {title: "Add GainNode", icon: AdjustIcon, action: () => {
    player.nodeManager.addNode(new AmethystGainNode(player.nodeManager.context, computeNodePosition({x, y})), source && target && [source, target]);
  }},
  {title: "Add AmethystSpectrumNode", icon: WaveIcon, action: () => {
    player.nodeManager.addNode(new AmethystSpectrumNode(player.nodeManager.context, computeNodePosition({x, y})), source && target && [source, target]);
  }},
];

const handleContextMenu = ({y, x}: MouseEvent) => {
  useContextMenu().open({x, y}, nodeMenu({x, y}));
};

const handleEdgeContextMenu = (e: EdgeMouseEvent) => {
  const source = player.nodeManager.nodes.value.find(node => node.properties.id === e.edge.source)!;
  const target = player.nodeManager.nodes.value.find(node => node.properties.id === e.edge.target)!;

  const {x, y} = e.event;
  useContextMenu().open({x, y}, [
    {title: "Remove connection", icon: RemoveIcon, red: true, action: () => source.disconnectFrom(target)},
    ...nodeMenu({x, y, source, target}),
  ]);
};

const handleNodeDragStop = (e: NodeDragEvent) => {
  player.nodeManager.nodes.value.find(node => node.properties.id === e.node.id)?.updatePosition(e.node.position);
};

const handleConnect = (e: Connection) => {
  const from = player.nodeManager.nodes.value.find(node => node.properties.id === e.source);
  const to = player.nodeManager.nodes.value.find(node => node.properties.id === e.target);

  if (from && to) {
    from.connectTo(to);
  }
};

const handleOpenFile = async () => {
  const buffer = await fs.open();
  buffer && player.nodeManager.loadGraph(JSON.parse(buffer.toString("utf8")));
  fitToView();
};

const fitToView = () => dash.value.fitView();
onKeyStroke("Delete", () => {
  dash.value.getSelectedNodes.forEach((nodeElement: any) => {
    const node = player.nodeManager.nodes.value
      .find(node => node.properties.id === nodeElement.id);

    node && player.nodeManager.removeNode(node);
  });
});

</script>

<template>
  <div
    ref="nodeEditor"
    class="flex-1 h-full w-full borderRight flex flex-col relative"
  >
    <div
      class="flex flex-col gap-2 absolute bottom-2 left-2 z-10 "
    >
      <SquareButton
        :icon="ResetIcon"
        @click="player.nodeManager.reset()"
      />
      <SquareButton
        :icon="LoadingIcon"
        @click="handleOpenFile"
      />
      <SquareButton
        :icon="SaveIcon"
        @click="fs.save(player.nodeManager.serialize())"
      />
      <SquareButton
        :icon="SelectNoneIcon"
        @click="fitToView"
      />
      <SquareButton
        :icon="MagnetIcon"
        :active="state.settings.isSnappingToGrid"
        @click="handleClick"
      />
    </div>

    <VueFlow
      ref="dash"
      v-model="elements"
      class="bg-surface-1000 p-2"
      :snap-to-grid="state.settings.isSnappingToGrid"
      :max-zoom="2.00"
      :connection-line-style="{ stroke: getThemeColorHex('--primary-700') }"
      :fit-view-on-init="true"
      :select-nodes-on-drag="false"
      @node-drag-stop="handleNodeDragStop"
      @connect="handleConnect"
      @edge-context-menu="handleEdgeContextMenu"
      @contextmenu.capture="handleContextMenu"
    >
      <Background
        :size="0.5"
        :variant="BackgroundVariant.Dots"
        :pattern-color="getThemeColorHex('--surface-500')"
      />

      <template
        v-for="node of player.nodeManager.nodes.value"
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
<style lang="postcss">
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

.vue-flow__node {
  .minimenu {
    @apply invisible opacity-0 duration-100;
  }

  &:hover {
    .minimenu {
      @apply visible opacity-100;
    }
  }

  &.selected > div {
    @apply border-primary-700;
  }
  &.selected .minimenu {
    @apply visible opacity-100;
  }
}

.vue-flow__edge {
  path {
    @apply stroke-surface-400 duration-100 transition-colors;
  }

  &:hover path {
    @apply stroke-primary-800;
  }

  &.selected path {
    @apply stroke-primary-700 !important;
  }
}

.vue-flow__handle {
  @apply border-primary-900 border-opacity-60 h-1/2 rounded-2px hover:border-primary-800 bg-surface-800 hover:bg-surface-600 duration-100 transition-colors;
}

</style>