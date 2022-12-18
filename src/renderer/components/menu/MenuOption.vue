<script lang="ts" setup>
import BaseKeyboardButton from "../input/BaseKeyboardButton.vue";

defineProps<{
  title: string
  icon?: any
  red?: boolean,
  shortcuts?: string[]
}>();
</script>

<template>
  <button
    :class="[
      title.includes('...') && 'cursor-pointer',
      red ? 'hover:bg-rose-600 hover:text-black hover:font-bold' : 'hover:bg-surface-600 hover:text-primary-800'
    ]"
    class="text-left text-11px py-1.5 px-6 w-full flex justify-between items-center"
  >
    <div class="flex gap-2 items-center">
      <component
        :is="icon"
        v-if="icon"
        class="h-3 w-3"
      />
      <div
        v-else
        class="h-3 w-3"
      />
      <p>{{ title }}</p>
    </div>
    <div class="text-7px font-aseprite flex gap-1">
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
