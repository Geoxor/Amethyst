<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useSlots } from "vue";
import BaseChip from "../BaseChip.vue";
import TitleSubtitle from "./TitleSubtitle.vue";
defineProps<{subsetting?:boolean, title: string, description?: string, warning?:string, icon: string }>();

const slots = useSlots();

const hasSubsetting = () => {
  return slots.subsettings && slots.subsettings().length > 0;
};

</script>

<template>
  <div
    class="rounded-8px  gap-2 w-full text-text_title  duration-user-defined"
    :class="[subsetting ? 'bg-[#101119] hover:bg-black hover:bg-opacity-20' : 'bg-[#141621] hover:bg-accent hover:bg-opacity-10']"
  >
    <div
      class="flex gap-4 items-center min-h-52px px-4 "
      :class="[hasSubsetting() ? 'pt-2' : 'py-2']"
    >
      <icon
        :icon="icon"
        class="w-5 h-5 min-w-5 min-h-5"
      />
      <title-subtitle
        :title="title"
        :subtitle="description"
        class="whitespace-normal"
      />
      <div class="flex-1" />
      <base-chip
        v-if="warning"
      >
        <p class=" text-11px font-weight-user-defined">
          {{ warning }}
        </p>
      </base-chip>
      <slot />
    </div>
    <slot
      name="subsettings"
    />
  </div>
</template>
