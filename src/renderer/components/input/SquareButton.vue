<script setup lang="ts">
defineProps<{ active?: boolean, icon?: any }>();
</script>

<template>
  <div
    :class="active && 'bg-cyan-500'"
    class="select-none magnet p-1  bg-surface-700 border-1 border-surface-500"
  >
    <component
      :is="icon"
      v-if="icon"
    />
  </div>
</template>
