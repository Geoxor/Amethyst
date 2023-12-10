<script setup lang="ts">
import BaseChip from "../BaseChip.vue";
import TitleSubtitle from "./TitleSubtitle.vue";
defineProps<{title: string, description?: string, warning?:string, icon: any }>();

</script>

<template>
  <div class="rounded-8px bg-[#141621] flex w-full gap-4 items-center py-2 px-4 text-text_title">
    <component
      :is="icon"
      class="w-5 h-5 min-w-5 min-h-5"
    />
    <title-subtitle
      :title="title"
      :subtitle="description"
      class="whitespace-normal"
    />
    <div class="flex-1" />
    <BaseChip
      v-if="warning"
    >
      <p class=" text-10px font-semibold">
        {{ warning }}
      </p>
    </BaseChip>
    <slot />
  </div>
</template>
