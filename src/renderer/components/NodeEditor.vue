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

let aughIndex = 0;

const isShowingAugh = ref(false);

const handleClick = () => {
  state.settings.isSnappingToGrid = !state.settings.isSnappingToGrid;
  aughIndex++;

  // Easter-egg credit @IchikaGerman
  if (aughIndex % 10 == 0) {
    const aughSound = new Audio("https://cdn.discordapp.com/attachments/848439598706065408/1035740493771964498/augh.flac");
    aughSound.play();
    isShowingAugh.value = true;
    setTimeout(() => isShowingAugh.value = false, 1000);
  }
};

</script>

<template>
  <div
    ref="nodeEditor"
    class="flex-1 h-full flex flex-col borderLeft relative"
  >
    <Teleport to="body">
      <transition>
        <img
          v-if="isShowingAugh"
          class="absolute top-1/2 left-1/2 transform-gpu -translate-x-1/2 scale-500  -translate-y-1/2"
          src="https://cdn.discordapp.com/emojis/798748646857244722.webp?size=512"
          alt=""
        >
      </transition>
    </Teleport>

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
      :connection-line-style="{ stroke: getThemeColorHex('--primary-800') }"
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