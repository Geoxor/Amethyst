<script lang="ts" setup>
defineProps<{
  title: string
  hint?: string
  shortcuts?: string[]
}>();
</script>

<template>
  <button
    class="text-left cursor-pointer hover:text-primary-800 hover:bg-surface-600 text-11px py-1.5 px-6 w-full flex justify-between items-center"
  >
    <p>{{ title }}</p>
    <div class="text-8px flex gap-1">
      <kbd
        v-for="(shortcut) of shortcuts"
        :key="shortcut"
      >{{ shortcut }}</kbd>
    </div>
  </button>
</template>
