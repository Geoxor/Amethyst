<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onClickOutside, onKeyStroke } from '@vueuse/core';
import { computed, ref } from 'vue';
import { onMounted } from "vue";
import { useRouter } from 'vue-router';

import { amethyst } from '@/amethyst';

import TitleText from '../v2/TitleText.vue';
const router = useRouter();
const commandPalette = ref<HTMLDivElement>();
const commandPaletteSearchInput = ref<HTMLInputElement>();
const searchText = ref("");

onMounted(() => {
  commandPaletteSearchInput.value!.focus()
  commandPaletteSearchInput.value!.click()
});

const closePalette = () => amethyst.state.showCommandPalette.value = false;

defineEmits([]);
onKeyStroke("Escape", closePalette);
onClickOutside(commandPalette, closePalette)

const defineCommand = (title: string, action: () => void, icon?: string) => ({
  title,
  action,
  icon
})

const commands = [
  defineCommand('Go to discovery', () => router.push({name: "discovery"}), 'ic:twotone-navigation'),
  defineCommand('Go to audio monitor', () => router.push({name: "audio-monitor"}), 'ic:twotone-navigation'),
  defineCommand('Go to queue', () => router.push({name: "queue"}), 'ic:twotone-navigation'),
  defineCommand('Go to favorites', () => router.push({name: "favorites"}), 'ic:twotone-navigation'),
  defineCommand('Go to node editor', () => router.push({name: "node-editor"}), 'ic:twotone-navigation'),
  defineCommand('Go to settings', () => router.push({name: "settings"}), 'ic:twotone-navigation'),
]

const filteredCommands = computed(() => {
  return commands.filter(command => command.title.toLowerCase().includes(searchText.value.toLowerCase()))
})

</script>

<template>
  <div class="absolute-xy bg-black/50 z-200 w-full h-full flex items-center justify-center">
    <div ref='commandPalette' class="bg-surface-700 rounded-16px flex flex-col gap-2 border-solid border-2px border-surface-500 p-2 min-w-128">
      <input ref='commandPaletteSearchInput' v-model="searchText" placeholder="Search for some action..." type="text" class="p-2 py-3 rounded-8px bg-surface-900 text-white">
      <div class="flex flex-col">
        <button v-for="command in filteredCommands" :key="command.title" class=" flex gap-2 items-center rounded-8px p-2 py-3 text-left hover:bg-primary/15 hover:text-primary" @click="command.action(); closePalette()">
          <Icon v-if="command.icon"  class="min-h-5 min-w-5" :icon="command.icon" />
          <TitleText :text="command.title"/>
        </button>
      </div>
    </div>
  </div>
</template>