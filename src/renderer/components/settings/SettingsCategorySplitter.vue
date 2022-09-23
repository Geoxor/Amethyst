<template>
  <div class="flex items-center gap-2 text-[#505050]">
    <p>{{ text }}</p>
    <splitter />
    <component v-if="icon" :is="icon" class="min-w-4" />
    <brush v-else class="min-w-4" />
  </div>
</template>

<script setup lang="ts">
import Brush from '../../icons/BrushIcon.vue';
import Splitter from '../Splitter.vue';
defineProps<{ text: string, icon?: any }>();
</script>
