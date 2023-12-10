<script setup lang="ts">
defineProps<{text: string}>();
</script>

<template>
  <p class="text-10px font-medium">
    {{ text }}
  </p>
</template>