<script setup lang="ts">
defineProps<{ icon: any }>();
</script>

<template>
  <div
    class="select-none bg-primary-800 hover:bg-primary-900 hover:text-black text-primary-800 bg-opacity-10 flex items-center leading-tight gap-1 rounded-4px py-1 px-2"
  >
    <component :is="icon" />
    <p>
      <slot />
    </p>
  </div>
</template>
