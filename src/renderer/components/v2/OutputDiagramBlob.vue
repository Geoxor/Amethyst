<script setup lang="ts">
import SubtitleText from "./SubtitleText.vue";
import TitleText from "./TitleText.vue";
defineProps<{title: string, subtitle?: string}>();
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-center h-48px w-48px bg-surface-600 rounded-8px">
      <slot />
    </div>
    <title-text :text="title" />
    <subtitle-text
      v-if="subtitle"
      :text="subtitle"
    />
  </div>
</template>