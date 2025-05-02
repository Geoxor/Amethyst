<script setup lang="ts">
import { amethyst } from "@/amethyst";
import type { AmethystAudioNode } from "@/logic/audio";
import { Icon } from "@iconify/vue";
const props = defineProps<{node: AmethystAudioNode}>();

</script>

<template>
  <div class="minimenu text-text_title cursor-pointer w-min items-center text-primary-1000 text-11px flex rounded-4px overflow-hidden bg-surface-800">
    <button
      class="unhook"
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
      class="reset"
      :class="[props.node.isBypassed && 'bg-red-600']"
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
      class="reset"
      @click="node.reset()"
    >
      <icon
        icon="ic:twotone-restart-alt"
        class="w-5 h-5"
      />
    </button>
    <button
      v-if="props.node.isRemovable"
      class="hover:bg-rose-600  hover:"
      @click="amethyst.player.nodeManager.removeNode(props.node)"
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
    @apply px-2 py-1 gap-1 flex items-center justify-center border-surface-500;
    &.unhook {
      @apply text-purple-400;

      &:hover{
        @apply bg-surface-600;
      }

      &:active {
        @apply active:bg-purple-400 active:text-surface-600;
      }
    }

    &.reset {
      &:hover:not(:active){
        @apply bg-surface-600 text-primary-800;
      }

      &:active {
        @apply bg-primary-800 text-surface-600;
      }
    }
  }
  button:not(:last-child) {
    @apply border-r-1;
  }
}
</style>