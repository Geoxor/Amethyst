<script lang="ts" setup>
defineProps<{
	title: string
	hint?: string
	shortcuts?: string[]
}>();
</script>

<template>
  <button
    class="hover:text-blue-300 hover:bg-gray-800 py-1 px-6 w-full flex justify-between items-center"
  >
    <p>{{ title }}</p>
    <div class="text-10px flex gap-1">
      <kbd v-for="(shortcut) of shortcuts" :key="shortcut">{{ shortcut }}</kbd>
    </div>
  </button>
</template>
