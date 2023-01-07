<script setup lang="ts">
defineProps<{ icon?: any }>();
</script>

<template>
  <div
    class="select-none w-min bg-primary-700 uppercase text-8px font-bold text-primary-700 bg-opacity-10 flex items-center leading-tight gap-1 rounded-4px py-0.5 px-2"
  >
    <component
      :is="icon"
      v-if="icon"
    />
    <p>
      <slot />
    </p>
  </div>
</template>
