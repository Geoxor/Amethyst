<template>
  <div class="flex items-center gap-2 text-primary-900">
    <p>{{ text }}</p>
    <splitter />
    <component v-if="icon" :is="icon" class="min-w-4" />
  </div>
</template>

<script setup lang="ts">
import Splitter from '@/components/Splitter.vue';
defineProps<{ text: string, icon?: any }>();
</script>
