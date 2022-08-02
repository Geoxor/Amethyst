<script lang="ts" setup>
defineProps<{
  title: string
  hint?: string
  shortcuts?: string[]
}>();
</script>

<template>
  <button
    class="text-left cursor-pointer text-white hover:text-secondary hover:bg-menu-option-hover py-2 px-6 w-full flex justify-between items-center">
    <p>{{ title }}</p>
    <div class="text-12px flex gap-1">
      <kbd v-for="(shortcut) of shortcuts" :key="shortcut">{{ shortcut }}</kbd>
    </div>
  </button>
</template>
