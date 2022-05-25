<script setup lang="ts">
defineProps<{ text: string }>();
</script>

<template>
  <div class="bg-tag-background text-[12px] font-cozette rounded-4px px-2 py-1 text-tag-text">
    {{ text }}
  </div>
</template>
