<script setup lang="ts">
import BaseChip from "../BaseChip.vue";
import TitleSubtitle from "./TitleSubtitle.vue";
defineProps<{subsetting?:boolean, title: string, description?: string, warning?:string, icon: any }>();

</script>

<template>
  <div
    class="rounded-8px  gap-2 w-full text-text_title  duration-100"
    :class="[subsetting ? 'bg-[#101119] hover:bg-black hover:bg-opacity-20' : 'bg-[#141621] hover:bg-accent hover:bg-opacity-10']"
  >
    <div class="flex gap-4 items-center min-h-52px py-2 px-4 ">
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
    <slot
      name="subsettings"
    />
  </div>
</template>
