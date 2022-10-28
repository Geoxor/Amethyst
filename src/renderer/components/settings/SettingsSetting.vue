<script setup lang="ts">
defineProps<{ text: string, icon?: any }>();
</script>

<template>
  <div class="flex items-center justify-between gap-2">
    <p>{{ text }}</p>
    <slot />
  </div>
</template>
