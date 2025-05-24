<script setup lang="ts">
</script>

<template>
  <input v-bind="$attrs" type="text">
</template>

<style scoped lang="postcss">
input {
  @apply bg-surface-600 max-w-48 w-full text-12px p-2 rounded-4px text-ellipsis;
}

input::placeholder {
  @apply text-text-title/50 text-12px;
}
</style>