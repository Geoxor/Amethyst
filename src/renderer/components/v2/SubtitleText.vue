<script setup lang="ts">
defineProps<{text: string}>();
</script>

<template>
  <p class="text-text_subtitle text-11px font-weight-user-defined overflow-hidden overflow-ellipsis">
    {{ text }}
  </p>
</template>