<template>
  <div :class="node.isDisabled && 'disabled'"
    class="flex h-full gap-2 rounded-4px hover:border-primary-900 duration-50 flex gap-2 border-surface-500 bg-surface-800 border-1 p-2">
    <div class="flex flex-col gap-2">
      <div class="flex gap-2 items-center">
        <component :is="icon" class="text-green-400" />
        <h1 class="text-primary-600 uppercase text-9px flex-1">{{ title }}</h1>
        <SquareButton :active="!node.isDisabled"
          @click.stop="node.isDisabled ? player.nodeManager.enableNode(node) : player.nodeManager.disableNode(node)" />
      </div>

      <slot />
      <h1 v-if="description" class=" text-white font-aseprite text-opacity-30"> {{ description }}</h1>
    </div>

    <div class="flex ">
      <db-meter v-if="!meterless" :node="node.node" />
    </div>
  </div>


  <Handle id="a" type="source" :position="Position.Right" />
  <Handle id="b" type="target" :position="Position.Left" />
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { usePlayer } from '../../amethyst';
import { AmethystAudioNode } from '../../logic/audio';
import DbMeter from '../DbMeter.vue';
import SquareButton from '../SquareButton.vue';
defineProps<{ title: string, icon: any, description?: string, node: AmethystAudioNode<any>, meterless?: boolean }>();
const player = usePlayer();
</script>

<style lang="postcss">
.disabled {
  @apply filter grayscale;
}
</style>