<script setup lang="ts">
import { amethyst } from "@/amethyst.js";
import type { AmethystAudioNode } from "@/logic/audio";
import { Icon } from "@iconify/vue";
import { useInspector } from "../Inspector";
const props = defineProps<{node: AmethystAudioNode}>();

const handleNodeRemove = () => {
  amethyst.player.nodeManager.removeNode(props.node);
  useInspector().hide();
};

</script>

<template>
  <div class="minimenu text-text-title cursor-pointer w-min items-center text-primary-1000 text-11px flex rounded-4px overflow-hidden bg-surface-800">
    <button
      @click="node.disconnect()"
    >
      <icon
        icon="ic:twotone-link-off"
        class="w-5 h-5"
      />
      {{ $t('node.unhook') }}
    </button>
    <button
      v-if="props.node.isBypassable"
      :class="[props.node.isBypassed && 'bypassed']"
      @click="node.toggleBypass()"
    >
      <icon
        icon="ic:twotone-power-settings-new"
        class="w-5 h-5"
      />
      {{ $t('node.bypass') }}
    </button>
    <button
      v-if="props.node.isResettable"
      @click="node.reset()"
    >
      <icon
        icon="ic:twotone-restart-alt"
        class="w-5 h-5"
      />
    </button>
    <button
      v-if="props.node.isRemovable"
      class="dangerous"
      @click="handleNodeRemove"
    >
      <icon
        icon="ic:twotone-delete"
        class="w-5 h-5"
      />
    </button>
  </div>
</template>

<style scoped lang="postcss">
.minimenu {
  button {
    @apply px-1 py-0.5 gap-1 flex items-center justify-center border-surface-500;

    &.dangerous {
      @apply hover:bg-alert-color hover:text-playback-controls-text;
    }

    &.bypassed {
      @apply bg-alert-color text-playback-controls-text;
    }

    &:hover:not(:active):not(.bypassed):not(.dangerous){
      @apply bg-surface-600;
    }

    &:active {
      @apply bg-surface-500 ;
    }
  }
  button:not(:last-child) {
    @apply border-r-1;
  }
}
</style>