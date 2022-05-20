<script setup lang="ts">
defineProps<{ text: string }>();
</script>

<template>
  <div class="bg-black text-[12px] font-fredoka rounded-4px px-2 py-1 text-white">
    {{ text }}
  </div>
</template>
