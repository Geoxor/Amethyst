<script lang="ts" setup>
import BaseKeyboardButton from "../input/BaseKeyboardButton.vue";

defineProps<{
  title: string
  icon?: any
  shortcuts?: string[]
}>();
</script>

<template>
  <button
    :class="[title.includes('...') && 'cursor-pointer']"
    class="text-left hover:text-primary-800 hover:bg-surface-600 text-11px py-1.5 px-6 w-full flex justify-between items-center"
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
