<script setup lang="ts">
defineProps<{ icon?: any, color?: string }>();
</script>

<template>
  <div
    class="select-none min-w-20 justify-center text-11px font-weight-user-defined flex items-center leading-tight gap-1 rounded-full py-1 px-2"
    :class="color ? `bg-${color} bg-opacity-15 text-${color}` : 'bg-primary text-primary bg-opacity-15'"
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
