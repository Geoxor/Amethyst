<script setup lang="ts">
import TitleSubtitle from "./TitleSubtitle.vue";
defineProps<{title: string, description?: string, icon: any }>();

</script>

<template>
  <div class="rounded-8px bg-[#141621] flex w-full gap-4 items-center py-2 px-4 text-text_title ">
    <component
      :is="icon"
      class="w-5 h-5"
    />
    <title-subtitle
      :title="title"
      :subtitle="description"
    />
    <div class="flex-1" />
    <slot />
  </div>
</template>
