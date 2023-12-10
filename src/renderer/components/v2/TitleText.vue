<script setup lang="ts">
defineProps<{text: string}>();
</script>

<template>
  <h1 class="duration-100 text-text_title text-13px font-semibold">
    {{ text }}
  </h1>
</template>
