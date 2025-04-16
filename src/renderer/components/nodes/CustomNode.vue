<script setup lang="ts">
import { amethyst, useShortcuts, useState } from "@/amethyst";
import { useContextMenu } from "@/components/ContextMenu";
import QuickMenu from "@/components/nodes/QuickMenu.vue";
import DbMeter from "@/components/visualizers/DbMeter.vue";
import { AmethystIcon } from "@/icons";
import { AmethystAudioNode } from "@/logic/audio";
import { IContextMenuOption } from "@/state";
import { Icon } from "@iconify/vue";
import { Handle, Position } from "@vue-flow/core";
import BaseChip from "../BaseChip.vue";
const state = useState();
const props = defineProps<{ title: string, icon: string, description?: string, node: AmethystAudioNode, meterless?: boolean }>();
// Context Menu options for this component 
const handleContextMenu = ({x, y}: MouseEvent) => {
  useContextMenu().open({x, y}, [
    { title: "Unhook", icon: "ic:twotone-link-off", action: () => props.node.disconnect() },
    { title: "Bypass", icon: "ic:twotone-power-settings-new", action: () => props.node.toggleBypass() },
    { title: "Reset", icon: "ic:twotone-restart-alt", action: () => props.node.reset() },
    props.node.isRemovable ? { title: "Remove", icon: AmethystIcon, red: true, action: () => amethyst.player.nodeManager.removeNode(props.node) } : undefined,
  ].filter(o => !!o) as IContextMenuOption[]);
};

</script>

<template>
  <div
    class="duration-user-defined flex select-none h-full text-text_title gap-2 relative rounded-4px hover:border-primary-800 border-surface-500 flex gap-2 bg-surface-800 border-1 p-2"
    @contextmenu.stop="handleContextMenu"
  >
    <quick-menu :node="node" />

    <div
      v-if="!meterless && state.settings.value.decibelMeterSeperatePrePost"
      class="flex "
    >
      <db-meter
        pre
        :node="node.pre"
        :channels="amethyst.player.getCurrentTrack()?.getChannels() || 2"
      />
    </div>

    <div class="flex flex-col gap-2">
      <div class="flex gap-2 items-center">
        <Icon
          :icon="icon"
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
        <BaseChip
          v-if="node.isBypassed"
          class="animate-pulse"
          color="bg-red-500 text-red-500"
        >
          Bypassed
        </BaseChip>
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
        :node="node.post"
        :channels="amethyst.player.getCurrentTrack()?.getChannels() || 2"
      />
    </div>
  </div>

  <Handle
    id="a"
    type="source"
    :position="Position.Right"
    class=""
  />
  <Handle
    id="b"
    type="target"
    :position="Position.Left"
    class=""
  />
</template>
