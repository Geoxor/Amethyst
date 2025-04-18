<script setup lang="ts">
import { Icon } from "@iconify/vue";
defineProps<{icon: string, text?:string}>();
</script>

<template>
  <button
    class="flex gap-1 hover:bg-primary hover:text-surface-800 duration-user-defined cursor-pointer items-center bg-accent bg-opacity-15 text-accent py-2 text-13px font-weight-user-defined rounded-8px gap-2"
    :class="[text? 'px-4' : 'px-2']"
  >
    <icon
      :icon="icon"
      class="w-5 h-5 min-w-5 min-h-5"
    />
    {{ text }}
  </button>
</template>
