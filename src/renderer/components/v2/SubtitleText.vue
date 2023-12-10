<script setup lang="ts">
defineProps<{text: string}>();
</script>

<template>
  <p class="text-text_subtitle text-10px font-semibold">
    {{ text }}
  </p>
</template>