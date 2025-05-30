<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onClickOutside, onKeyStroke } from '@vueuse/core';
import { computed, ref } from 'vue';
import { onMounted } from "vue";

import { amethyst } from '@/amethyst';

import TitleText from '../v2/TitleText.vue';
import { commands } from "./registry";
const commandPalette = ref<HTMLDivElement>();
const commandPaletteSearchInput = ref<HTMLInputElement>();

const searchText = ref("");

onMounted(() => {
  commandPaletteSearchInput.value!.focus()
  commandPaletteSearchInput.value!.click()
});

const closePalette = () => amethyst.state.showCommandPalette.value = false;

const filteredCommands = computed(() => {
  return commands.filter(command => command.title.toLowerCase().includes(searchText.value.toLowerCase()))
})

defineEmits([]);
onKeyStroke("Escape", closePalette);
onKeyStroke("Enter", () => filteredCommands.value[0].action());
onClickOutside(commandPalette, closePalette)

</script>

<template>
  <div class="absolute-xy bg-black/50 z-200 w-full h-full flex items-center justify-center">
    <div ref='commandPalette' class="bg-surface-700 rounded-16px flex flex-col gap-2 border-solid border-2px border-surface-500 p-2 min-w-128">
      <input ref='commandPaletteSearchInput' v-model="searchText" placeholder="Search for some action..." type="text" class="p-2 py-3 rounded-8px bg-surface-900 text-white" @keydown.stop>
      <div class="flex flex-col">
        <template v-if='filteredCommands.slice(0, 8).length > 0'>
          <button v-for="command in filteredCommands.slice(0, 8)" :key="command.title" class=" flex gap-2 items-center rounded-8px p-2 py-3 text-left focus:bg-accent/15 focus:text-accent hover:bg-primary/15 hover:text-primary" @click="command.action(); closePalette()">
            <Icon v-if="command.icon"  class="min-h-5 min-w-5" :icon="command.icon" />
            <TitleText :text="$t(command.title)"/>
          </button>
        </template>
        <TitleText v-else :text="$t('command.no_search_results')"/>
      </div>
    </div>
  </div>
</template>