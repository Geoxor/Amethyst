<template>
  <div :class="disabled && 'disabled'"
    class="rounded-4px hover:border-primary-900 duration-50 flex flex-col gap-2 border-surface-500 bg-surface-800 border-1 p-2">
    <div class="flex gap-2 items-center">
      <component :is="icon" class="text-green-400" />
      <h1 class="text-primary-600 uppercase text-9px flex-1">{{ title }}</h1>
      <SquareButton :active="!disabled" @click="disabled = !disabled" />

    </div>
    <slot />
    <h1 v-if="description" class=" text-white font-aseprite text-opacity-30"> {{ description }}</h1>

  </div>
  <Handle id="a" type="source" :position="Position.Right" />
  <Handle id="b" type="target" :position="Position.Left" />
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { ref } from 'vue';
import SquareButton from '../SquareButton.vue';
defineProps<{ title: string, icon: any, description?: string }>();
const disabled = ref(false);

</script>

<style scoped lang="postcss">
.disabled {
  @apply filter grayscale;
}
</style>