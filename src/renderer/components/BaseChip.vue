<script setup lang="ts">
defineProps<{ icon?: any, color?: string }>();
</script>

<template>
  <div
    class="select-none w-min  uppercase text-8px font-bold flex items-center leading-tight gap-1 rounded-4px py-0.5 px-2"
    :class="color ? `${color} bg-opacity-15` : 'bg-primary-700 text-primary-700 bg-opacity-15'"
  >
    <component
      :is="icon"
      v-if="icon"
    />
    <p class="flex items-center gap-1">
      <slot />
    </p>
  </div>
</template>
