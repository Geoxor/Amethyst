<script setup lang="ts">
import { usePlayer } from "@/amethyst";
import { ResetIcon, RemoveIcon, DisconnectIcon } from "@/icons/material";
import { AmethystAudioNode } from "@/logic/audio";
const props = defineProps<{node: AmethystAudioNode<AudioNode>}>();
const player = usePlayer();

</script>

<template>
  <div class="minimenu absolute cursor-pointer items-center -top-8 text-primary-1000 left-1/2 transform-gpu text-8px -translate-x-1/2 flex rounded-4px overflow-hidden bg-surface-800">
    <button
      class=" hover:bg-surface-600 text-purple-400"
      @click="node.disconnect()"
    >
      <DisconnectIcon class="w-3" />
      Unhook
    </button>
    <button
      class="hover:bg-surface-600 hover:text-primary-800"
      @click="node.reset()"
    >
      <ResetIcon class="w-3" />
    </button>
    <button
      v-if="props.node.isRemovable"
      class="hover:bg-rose-600 hover:text-black"
    >
      <RemoveIcon
        class="w-3"
        @click="player.nodeManager.removeNode(props.node)"
      />
    </button>
  </div>
</template>

<style scoped lang="postcss">
.minimenu {
  button {
    @apply px-2 gap-1 flex items-center justify-center border-surface-500;
  }
  button:not(:last-child) {
    @apply border-r-1;
  }
}
</style>