<script setup lang="ts">
defineProps<{title: string}>();

</script>

<template>
  <header class="p-2">
    <h1 class="font-zen-dots text-text_title">
      {{ title }}
    </h1>
  </header>
</template>

<style scoped lang="postcss">

</style>