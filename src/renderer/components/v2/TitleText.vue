<script setup lang="ts">
defineProps<{text: string}>();
</script>

<template>
  <h1 class="duration-100 text-13px font-medium">
    {{ text }}
  </h1>
</template>
