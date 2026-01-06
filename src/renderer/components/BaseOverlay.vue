<script setup lang="ts">
defineEmits<{
  close: () => void;
}>();
</script>

<template>
  <div
    class=" select-none rounded-8px w-full h-full truncate bg-black bg-opacity-75 flex items-center justify-center absolute-xy z-50"
    @click.self="$emit('close')"
  >
    <slot />
  </div>
</template>
