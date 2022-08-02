<template>
  <div class="flex items-center gap-2 text-[#505050]">
    <p>{{ text }}</p>
    <div class="h-1px w-full bg-current"></div>
    <component v-if="icon" :is="icon" class="min-w-4" />
    <brush v-else class="min-w-4" />
  </div>
</template>

<script setup lang="ts">
import Brush from '../../icons/Brush.vue';
defineProps<{ text: string, icon?: any }>();
</script>
