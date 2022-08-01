<script setup lang="ts">
defineProps<{ text: string }>();
</script>

<template>
  <div class="bg-white text-black text-12px px-2 py-1">
    <p>{{ text }}</p>
  </div>
</template>
  