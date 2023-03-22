<script setup lang="ts">
defineProps<{ text: string, icon?: any }>();
</script>

<template>
  <div class="flex items-center text-primary-900 hover:text-primary-800 justify-between gap-2">
    <p>{{ text }}</p>
    <slot />
  </div>
</template>
