<script setup lang="ts">
defineProps<{ active?: boolean, icon?: any, text?: string }>();
</script>

<template>
  <button
    :class="active && 'active'"
    class="select-none text-primary-1000 hover:text-white p-1 bg-surface-700 border-1 border-surface-500"
  >
    <component
      :is="icon"
      v-if="icon"
    />

    <p
      v-if="text"
      class="font-aseprite text-primary-900"
    >
      {{ text }}
    </p>
  </button>
</template>

<style scoped lang="postcss">
button {
  &.active {
    @apply bg-cyan-500 hover:bg-cyan-400 text-black;
  }

  &:not(.active) {
    @apply hover:bg-cyan-700;
  }
}
</style>