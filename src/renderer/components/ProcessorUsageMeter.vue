<script setup lang="ts">
defineProps<{value: number; }>();
</script>

<template>
  <div class="flex justify-center relative items-center bg-surface-600 text-primary-800 duration-250 w-6 sm:w-12 h-3.5 box-content ">
    <p class="font-aseprite z-10">
      {{ value.toFixed(0) }}%
    </p>
    <div
      class="background bg-current h-full duration-500 h-full absolute top-0 left-0"
      :style="`width: ${value}%;`"
    />
  </div>
</template>
