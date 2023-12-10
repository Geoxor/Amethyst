<script setup lang="ts">
defineProps<{text: string}>();
</script>

<template>
  <p class="duration-100 text-text_subtitle text-10px font-semibold">
    {{ text }}
  </p>
</template>