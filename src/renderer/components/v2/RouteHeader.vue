<script setup lang="ts">
defineProps<{title: string}>();

</script>

<template>
  <header class="flex gap-2 h-8 min-h-8 justify-between items-center">
    <h1 class="font-zen-dots text-text_title">
      {{ title }}
    </h1>
    <slot />
  </header>
</template>

<style scoped lang="postcss">

</style>