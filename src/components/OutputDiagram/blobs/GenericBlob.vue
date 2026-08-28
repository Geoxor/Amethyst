<script setup lang="ts">
import SubtitleText from "@/components/v2/SubtitleText.vue";
import TitleText from "@/components/v2/TitleText.vue";
defineProps<{ title: string; subtitle?: string; clickable?: boolean }>();
</script>

<template>
  <div
    class="flex flex-col gap-3 relative"
    :class="[subtitle && 'w-full']"
  >
    <div
      :class="[clickable && 'hover:bg-surface-400 cursor-pointer transform-gpu hover:scale-110']"
      class="flex items-center duration-user-defined justify-center h-48px w-48px bg-surface-600 rounded-4px text-text-title"
    >
      <slot />
    </div>

    <div class="flex flex-col ">
      <title-text
        :text="title"
      />
      <subtitle-text
        v-if="subtitle"
        class="whitespace-pre"
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
