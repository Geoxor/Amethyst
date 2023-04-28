<script setup lang="ts">
import { amethyst, useState } from "@/amethyst";
import BaseToolbarButton from "@/components/BaseToolbarButton.vue";
import { MagnetIcon, SaveIcon, AdjustIcon, AzimuthIcon, FilterIcon, SelectNoneIcon, AddIcon, WaveIcon, RemoveIcon, LoadingIcon, SplitIcon } from "@/icons/material";
import { getThemeColorHex } from "@/logic/color";
import { Background, BackgroundVariant } from "@vue-flow/additional-components";
import { Connection, EdgeMouseEvent, NodeDragEvent, VueFlow } from "@vue-flow/core";
import { onKeyStroke } from "@vueuse/core";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { AmethystPannerNode, AmethystGainNode, AmethystSpectrumNode, AmethystFilterNode, AmethystEightBandEqualizerNode } from "@/nodes";
import { AmethystAudioNode } from "@/logic/audio";
import { Coords } from "@shared/types";
import { useContextMenu } from "@/components/ContextMenu";
import BaseToolbar from "@/components/BaseToolbar.vue";
import BaseToolbarSplitter from "@/components/BaseToolbarSplitter.vue";
const dash = ref();
const nodeEditor = ref();
type NodeMenuOptions = Coords & {source?: AmethystAudioNode, target?: AmethystAudioNode};

let resizeObserver: ResizeObserver;

onMounted(() => {
  resizeObserver = new ResizeObserver(fitToView);
  resizeObserver.observe(nodeEditor.value);
}); 

onUnmounted(() => {
  resizeObserver.disconnect();
});

// Proxy function because dash.value is innaccessible in template code
const fitToView = () => dash.value.fitView();

const state = useState();
const elements = computed(() => [...amethyst.player.nodeManager.getNodeProperties(), ...amethyst.player.nodeManager.getNodeConnections()]);

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
    amethyst.player.nodeManager.addNode(new AmethystFilterNode(amethyst.player.nodeManager.context, computeNodePosition({x, y})), source && target && [source, target]);
  }},
  {
    title: "Add EightBandEqualizerNode", 
    icon: FilterIcon, 
    action: () => {
      amethyst.player.nodeManager.addNode(new AmethystEightBandEqualizerNode(amethyst.player.nodeManager.context, computeNodePosition({x, y})), source && target && [source, target]);
    }
  },
  {title: "Add PannerNode", icon: AzimuthIcon, action: () => {
    amethyst.player.nodeManager.addNode(new AmethystPannerNode(amethyst.player.nodeManager.context, computeNodePosition({x, y})), source && target && [source, target]);
  }},
  {title: "Add GainNode", icon: AdjustIcon, action: () => {
    amethyst.player.nodeManager.addNode(new AmethystGainNode(amethyst.player.nodeManager.context, computeNodePosition({x, y})), source && target && [source, target]);
  }},
  {title: "Add AmethystSpectrumNode", icon: WaveIcon, action: () => {
    amethyst.player.nodeManager.addNode(new AmethystSpectrumNode(amethyst.player.nodeManager.context, computeNodePosition({x, y})), source && target && [source, target]);
  }},
];

const handleContextMenu = ({y, x}: MouseEvent) => {
  useContextMenu().open({x, y}, nodeMenu({x, y}));
};

const handleEdgeContextMenu = (e: EdgeMouseEvent) => {
  const source = amethyst.player.nodeManager.nodes.value.find(node => node.properties.id === e.edge.source)!;
  const target = amethyst.player.nodeManager.nodes.value.find(node => node.properties.id === e.edge.target)!;

  const {x, y} = (e.event as MouseEvent);
  useContextMenu().open({x, y}, [
    {title: "Remove connection", icon: RemoveIcon, red: true, action: () => source.disconnectFrom(target)},
    ...nodeMenu({x, y, source, target}),
  ]);
};

const handleNodeDragStop = (e: NodeDragEvent) => {
  amethyst.player.nodeManager.nodes.value.find(node => node.properties.id === e.node.id)?.updatePosition(e.node.position);
};

const handleConnect = (e: Connection) => {
  const from = amethyst.player.nodeManager.nodes.value.find(node => node.properties.id === e.source);
  const to = amethyst.player.nodeManager.nodes.value.find(node => node.properties.id === e.target);

  if (from && to) {
    from.connectTo(to);
  }
};

const handleOpenFile = async () => {
  const result = await amethyst.openFileDialog([{name: "Amethyst Node Graph", extensions: ["ang"]}]);
  if (result.canceled) return;
  
  fetch(result.filePaths[0])
  .then(response => response.blob())
  .then(blob => {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => reader.result ? resolve(reader.result as ArrayBuffer) : reject("reader null");
      reader.readAsArrayBuffer(blob);
    });
  })
  .then(buffer => {
    // Use the loaded buffer
    amethyst.player.nodeManager.loadGraph(JSON.parse(buffer.toString()));
  });

  // Fixes volume resetting to 100% when loading a new graph
  amethyst.player.setVolume(amethyst.player.volume.value);

  fitToView;
};

const handleSaveFile = () => {
  
};

onKeyStroke("Delete", () => {
  dash.value.getSelectedNodes.forEach((nodeElement: any) => {
    const node = amethyst.player.nodeManager.nodes.value
      .find(node => node.properties.id === nodeElement.id);

    node && amethyst.player.nodeManager.removeNode(node);
  });
});

</script>

<template>
  <div
    ref="nodeEditor"
    class="flex-1 h-full w-full borderRight flex flex-col"
  >
    <BaseToolbar>
      <BaseToolbarButton
        :icon="AddIcon"
        tooltip-text="Add Node"
        @click="useContextMenu().open({x: $event.clientX, y: $event.clientY}, nodeMenu({x: $event.clientX, y: $event.clientY}));"
      />

      <BaseToolbarSplitter />

      <BaseToolbarButton
        :icon="SelectNoneIcon"
        tooltip-text="Fit to View"
        @click="fitToView"
      />
      <BaseToolbarButton
        :icon="MagnetIcon"
        :active="state.settings.value.isSnappingToGrid"
        tooltip-text="Snap to Grid"
        @click="state.settings.value.isSnappingToGrid = !state.settings.value.isSnappingToGrid"
      />

      <BaseToolbarSplitter />

      <BaseToolbarButton
        :icon="LoadingIcon"
        tooltip-text="Open File"
        @click="handleOpenFile"
      />

      <BaseToolbarButton
        :icon="SaveIcon"
        tooltip-text="Save as"
        @click="handleSaveFile"
      />
      
      <BaseToolbarSplitter />

      <BaseToolbarButton
        :icon="RemoveIcon"
        tooltip-text="Reset All"
        @click="amethyst.player.nodeManager.reset()"
      />
    </BaseToolbar>

    <VueFlow
      ref="dash"
      v-model="elements"
      class="bg-surface-1000 p-2"
      :snap-to-grid="state.settings.value.isSnappingToGrid"
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
        v-for="node of amethyst.player.nodeManager.nodes.value"
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