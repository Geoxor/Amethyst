<script setup lang="ts">
defineProps<{text: string}>();
</script>

<template>
  <h1 class="text-13px truncate text-ellipsis font-weight-user-defined">
    {{ text }}
  </h1>
</template>
