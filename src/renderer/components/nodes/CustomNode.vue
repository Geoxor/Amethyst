<script setup lang="ts">
import { usePlayer, useShortcuts, useState } from "@/amethyst";
import DbMeter from "@/components/visualizers/DbMeter.vue";
import {RestartIcon, BroomIcon} from "@/icons/plumpy";
import { AmethystAudioNode } from "@/logic/audio";
import { Handle, Position } from "@vue-flow/core";
const props = defineProps<{ title: string, icon: any, description?: string, node: AmethystAudioNode<any>, meterless?: boolean }>();
const player = usePlayer();
const state = useState();

// Context Menu options for this component 
const handleContextMenu = ({x, y}: MouseEvent) => {
  state.openContextMenuAt(x, y, [
    { title: "Reset", icon: RestartIcon, action: () => props.node.reset() },
    { title: "Remove", icon: BroomIcon, action: () => player.nodeManager.removeNode(props.node) },
  ]);
};

</script>

<template>
  <div
    :class="node.isDisabled && 'disabled'"
    class="flex select-none h-full gap-2 rounded-4px hover:border-primary-800 duration-100 flex gap-2 border-surface-500 bg-surface-800 border-1 p-2"
    @contextmenu.stop="handleContextMenu"
  >
    <div class="flex flex-col gap-2">
      <div class="flex gap-2 items-center">
        <component
          :is="icon"
          class="text-green-400"
        />
        <h1 class="text-primary-600 uppercase text-9px flex-1">
          {{ title }}
          <p
            v-if="useShortcuts().isAltPressed.value"
            class="mt-0.5 text-surface-400 text-4px font-aseprite"
          >
            {{ node.properties.id }}
          </p>
        </h1>
      </div>

      <slot />
      <h1
        v-if="description"
        class="text-primary-900 font-aseprite"
      >
        {{ description }}
      </h1>
    </div>

    <div class="flex ">
      <db-meter
        v-if="!meterless"
        :node="node.audioNode"
        :channels="player.getCurrentTrack()?.getChannels() || 2"
      />
    </div>
  </div>

  <Handle
    id="a"
    type="source"
    :position="Position.Right"
  />
  <Handle
    id="b"
    type="target"
    :position="Position.Left"
  />
</template>

<style lang="postcss">
.disabled {
  @apply filter grayscale;
}
</style>