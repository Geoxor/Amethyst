<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onClickOutside, onKeyStroke, useKeyModifier } from '@vueuse/core';
import { computed, ref } from 'vue';
import { onMounted, watch } from "vue";
const { t } = useI18n()

import { useI18n } from "vue-i18n";

import { amethyst } from '@/amethyst';

import TitleText from '../v2/TitleText.vue';
import { commands, ICommandDefinition } from "./registry";
const commandPalette = ref<HTMLDivElement>();
const commandPaletteSearchInput = ref<HTMLInputElement>();

const searchText = ref("");
const selectedCommand = ref(0);

const NUMBER_OF_COMMANDS = 8;

onMounted(() => {
  commandPaletteSearchInput.value!.focus()
  commandPaletteSearchInput.value!.click()
});

const closePalette = () => amethyst.state.showCommandPalette.value = false;

const filteredCommands = computed(() => {
  return commands.filter(command => t(command.title).toLowerCase().includes(searchText.value.toLowerCase()))
})

watch(() => filteredCommands.value.length, (newLength) => {
  if (newLength <= selectedCommand.value) selectedCommand.value = Math.max(0, newLength - 1);
})

const shiftState = useKeyModifier('Shift')

const selectNext = () => {
  selectedCommand.value += 1
  if (selectedCommand.value > Math.min( NUMBER_OF_COMMANDS - 1,  filteredCommands.value.length - 1)) selectedCommand.value = 0;
}
const selectPrevious = () => {
  selectedCommand.value -= 1;
  if (selectedCommand.value < 0) selectedCommand.value = Math.min( NUMBER_OF_COMMANDS - 1, filteredCommands.value.length - 1);
}
onKeyStroke("Escape", closePalette);
onKeyStroke("Enter", (e) => {
  e.preventDefault()
  const command = filteredCommands.value[selectedCommand.value];
  command.action()
  closePalette();
});
onKeyStroke("ArrowDown", selectNext);
onKeyStroke("ArrowUp", selectPrevious);
onKeyStroke("Tab", (e) => {
  e.preventDefault()
  shiftState.value == false ? selectNext() : selectPrevious()
});

onKeyStroke("Enter", () => filteredCommands.value[0].action());
onClickOutside(commandPalette, closePalette)

const handleClick = (command: ICommandDefinition) => {
  command.action(); 
  closePalette()
}

document.addEventListener('keydown', console.log)

</script>

<template>
  <div class="absolute-xy bg-black/50 z-200 w-full h-full flex items-center justify-center text-text-title">
    <div ref='commandPalette' class="bg-surface-700 rounded-16px flex flex-col gap-2 border-solid border-1px border-surface-500 p-2 min-w-128">
      <input ref='commandPaletteSearchInput' v-model="searchText" :placeholder="$t('search.command_palette.placeholder')" type="text" class="p-2 py-3 rounded-8px bg-surface-900 ">
      <div class="flex flex-col">
        <template v-if='filteredCommands.slice(0, NUMBER_OF_COMMANDS).length > 0'>
          <section v-for="(command, i) in filteredCommands.slice(0, NUMBER_OF_COMMANDS)" :key="command.title" :class="[selectedCommand == i && 'active']" @click="handleClick(command)">
            <Icon v-if="command.icon"  class="min-h-5 min-w-5" :icon="command.icon" />
            <TitleText :text="$t(command.title)"/>
          </section>
        </template>
        <TitleText v-else class='m-1' :text="$t('command.no_search_results')"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
section {
  @apply flex gap-2 items-center rounded-8px p-2 py-3 text-left focus:bg-accent/15 focus:text-accent active:bg-accent/15 active:text-accent hover:bg-primary/15 hover:text-primary;
  &.active {
    @apply bg-accent/15 text-accent;
  }
}

input::placeholder {
  @apply text-text-title/50 text-12px;
}
</style>