<script setup lang="ts">
import SubtitleText from "./SubtitleText.vue";
import TitleText from "./TitleText.vue";
defineProps<{title: string, subtitle?: string}>();
</script>

<template>
  <div class="flex flex-col gap-3 relative">
    <div class="flex items-center justify-center h-48px w-48px bg-surface-600 rounded-4px">
      <slot />
    </div>
    
    <div class="flex flex-col">
      <title-text
        :text="title"
      />
      <subtitle-text
        v-if="subtitle"
        :text="subtitle"
      />
    </div>
    <div
      v-if="subtitle"
      class="w-full h-2px bg-surface-600 absolute top-24px -z-10"
    >
      <div class="h-4 w-4 bg-surface-600 transform-gpu rotate-45 absolute left-9 -top-7px" />
    </div>
  </div>
</template>