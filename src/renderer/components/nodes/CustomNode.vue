<script setup lang="ts">
import { amethyst } from "@/amethyst.js";
import { useContextMenu } from "@/components/ContextMenu";
import QuickMenu from "@/components/nodes/QuickMenu.vue";
import DbMeter from "@/components/visualizers/DbMeter.vue";
import type { AmethystAudioNode } from "@/logic/audio";
import type { IContextMenuOption } from "@/state";
import { Icon } from "@iconify/vue";
import { Handle, Position } from "@vue-flow/core";
import BaseChip from "../BaseChip.vue";

const props = defineProps<{ title: string, description?: string, node: AmethystAudioNode, meterless?: boolean }>();
// Context Menu options for this component 
const handleContextMenu = ({x, y}: MouseEvent) => {
  useContextMenu().open({x, y}, [
    { title: "Unhook", icon: "ic:twotone-link-off", action: () => props.node.disconnect() },
    { title: "Bypass", icon: "ic:twotone-power-settings-new", action: () => props.node.toggleBypass() },
    { title: "Reset", icon: "ic:twotone-restart-alt", action: () => props.node.reset() },
    props.node.isRemovable ? { title: "Remove", icon: "ic:twotone-delete", red: true, action: () => amethyst.player.nodeManager.removeNode(props.node) } : undefined,
  ].filter(o => !!o) as IContextMenuOption[]);
};

</script>

<template>
  <div
    class="duration-user-defined flex select-none h-full text-text_title gap-2 relative rounded-4px hover:border-primary-800 border-surface-500 flex gap-2 bg-surface-800 border-1 p-2"
    @contextmenu.stop="handleContextMenu"
  >
    <quick-menu
      :node="node"
      class="absolute left-1/2 -top-8 transform-gpu -translate-x-1/2"
    />

    <div
      v-if="!meterless && amethyst.state.settings.metering.decibelMeter.separatePrePost"
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
        <icon
          :icon="node.properties.icon"
        />
        <h1 class="text-primary-600 uppercase text-11px flex-1">
          {{ title }}
        </h1>
        <base-chip
          v-if="node.isBypassed"
          class="animate-pulse text-alert-color bg-alert-color bg-opacity-15"
        >
          {{ $t('node.bypassed') }}
        </base-chip>
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

  <handle
    id="a"
    type="source"
    :position="Position.Right"
    class=""
  />
  <handle
    id="b"
    type="target"
    :position="Position.Left"
    class=""
  />
</template>
