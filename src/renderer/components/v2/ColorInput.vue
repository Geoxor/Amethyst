<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useVModel } from '@vueuse/core';
import { ref } from 'vue';

import { amethyst } from '@/amethyst';

import TitleSubtitle from './TitleSubtitle.vue';
type CustomColorKey = keyof typeof amethyst.state.defaultSettings.appearance.customColors.colors;
const props = defineProps<{modelValue: string; colorName?: CustomColorKey }>();
const emit = defineEmits(["update:modelValue"]);
const value = useVModel(props, "modelValue", emit);
const input = ref<HTMLInputElement>();
</script>

<template>
  <div class="colorPicker overflow-hidden rounded-8px relative box-content cursor-pointer flex justify-between items-center duration-user-defined border-solid border-transparent border-2px gap-2 px-3 py-0.5 min-w-24" :style="`background-color: ${value}33; color: ${value};`" @click="input!.click()">
    <title-subtitle :title="colorName" :subtitle="value" />
    <div class="h-32 w-32 absolute -top-1/2 -right-20 transform-gpu -rotate-70 bg-current"></div>
    <input id="head" ref="input" v-model="value" class='invisible h-0 w-0 left-16 absolute' type="color" name="head" />
    <Icon v-if="colorName" icon="ic:twotone-restart-alt" class="h-5 w-5 min-w-5 min-h-5 text-surface-700 opacity-75 hover:opacity-100 z-1 " @click.stop="value = amethyst.state.defaultSettings.appearance.customColors.colors[colorName]" />
  </div>
</template>

<style lang="postcss">
.colorPicker {
  @apply hover:border-current lowercase;
}

.colorPicker h1 {
  @apply italic;
}
</style>