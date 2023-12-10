
<script setup lang="ts">
import TitleText from "./TitleText.vue";
import SubtitleText from "./SubtitleText.vue";
defineProps<{title?: string, subtitle?: string; alignment?: "left" | "center" | "right"}>();
</script>

<template>
  <div
    class="flex flex-col gap-5px text-left py-1"
    :class="[
      alignment == 'left' && 'text-left',
      alignment == 'center' && 'text-center',
      alignment == 'right' && 'text-right',
    ]"
  >
    <title-text
      :text="title ?? 'Title'"
      class="text-text_title"
    />
    <subtitle-text
      :text="subtitle || 'Subtitle'"
      class="text-text_subtitle"
    />
  </div>
</template>