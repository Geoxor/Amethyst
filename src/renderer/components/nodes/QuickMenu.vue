<script setup lang="ts">
import { ResetIcon, RemoveIcon, DisconnectIcon } from "@/icons/material";
import { AmethystAudioNode } from "@/logic/audio";
import { player } from "@/logic/player";
const props = defineProps<{node: AmethystAudioNode}>();

</script>

<template>
  <div class="minimenu absolute cursor-pointer items-center -top-8 text-primary-1000 left-1/2 transform-gpu text-9px -translate-x-1/2 flex rounded-4px overflow-hidden bg-surface-800">
    <button
      class="unhook"
      @click="node.disconnect()"
    >
      <DisconnectIcon class="w-3" />
      Unhook
    </button>
    <button
      v-if="props.node.isBypassable"
      class="reset"
      @click="node.toggleBypass()"
    >
      <DisconnectIcon class="w-3" />
      Bypass
    </button>
    <button
      v-if="props.node.isResettable"
      class="reset"
      @click="node.reset()"
    >
      <ResetIcon class="w-3" />
    </button>
    <button
      v-if="props.node.isRemovable"
      class="hover:bg-rose-600  hover:text-black"
      @click="player.nodeManager.removeNode(props.node)"
    >
      <RemoveIcon
        class="w-3"
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