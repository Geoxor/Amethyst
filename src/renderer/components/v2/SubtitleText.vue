<script setup lang="ts">
defineProps<{text: string}>();
</script>

<template>
  <p class="text-text_subtitle text-10px font-weight-user-defined">
    {{ text }}
  </p>
</template>