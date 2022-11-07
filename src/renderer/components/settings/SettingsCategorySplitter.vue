<script setup lang="ts">
import Splitter from "@/components/SplitterLine.vue";
defineProps<{ text: string, icon?: any }>();
</script>

<template>
  <div class="flex items-center gap-2 text-primary-800">
    <p>{{ text }}</p>
    <splitter />
    <component
      :is="icon"
      v-if="icon"
      class="min-w-4"
    />
  </div>
</template>
