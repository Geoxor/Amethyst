<script lang="ts" setup>
import { Icon } from "@iconify/vue";

import BaseKeyboardButton from "../input/BaseKeyboardButton.vue";
import TitleText from "../v2/TitleText.vue";
defineProps<{
  title: string;
  icon?: string;
  red?: boolean;
  shortcuts?: string[];
}>();
</script>

<template>
  <button
    :class="[
      title.includes('...') && 'cursor-pointer',
      red ? 'hover:bg-rose-600 hover:font-bold' : 'hover:bg-surface-600 hover:text-accent'
    ]"
    class="text-left h-32px text-11px py-2 px-4 w-full flex justify-between items-center"
  >
    <div class="flex gap-4 items-center">
      <icon
        v-if="icon"
        :icon="icon"
        class="h-4 w-4"
      />
      <div
        v-else
        class="h-4 w-4"
      />
      <title-text
        :text="title"
      />
    </div>
    <div class="flex gap-1">
      <base-keyboard-button
        v-for="(shortcut) of shortcuts"
        :key="shortcut"
        :button="shortcut"
      >
        {{ shortcut }}
      </base-keyboard-button>
    </div>
  </button>
</template>
