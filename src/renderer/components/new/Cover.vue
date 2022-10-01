<template>
  <div class="min-w-12 min-h-12 w-12 h-12 bg-white rounded-4px bg-center bg-contain"
    :style="`background-image: url('${url}');`">
  </div>
</template>

<script setup lang="ts">
defineProps<{ url: string }>();
</script>
