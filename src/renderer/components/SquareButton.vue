<template>
  <div :class="active && 'active'" class="select-none magnet p-1 bg-surface-700 border-1 border-surface-500">
    <component v-if="icon" :is="icon" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ active: boolean, icon?: any }>();

</script>

<style scoped lang="postcss">

</style>