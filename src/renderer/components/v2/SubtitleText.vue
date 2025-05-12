<script setup lang="ts">
defineProps<{text: string}>();
</script>

<template>
  <p class="text-text-subtitle leading-4 text-11px font-weight-user-defined truncate text-ellipsis">
    {{ text }}
  </p>
</template>