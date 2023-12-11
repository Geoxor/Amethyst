
<script setup lang="ts">
import TitleText from "./TitleText.vue";
import SubtitleText from "./SubtitleText.vue";
import { useState } from "@/amethyst";
defineProps<{title?: string, subtitle?: string; alignment?: "left" | "center" | "right"}>();
const state = useState();

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
      :style="`transition-duration: ${state.settings.value.animationDuration}ms`"
    />
    <subtitle-text
      v-if="!state.settings.value.minimalistMode"
      :text="subtitle || 'Subtitle'"
      :style="`transition-duration: ${state.settings.value.animationDuration}ms`"
    />
  </div>
</template>