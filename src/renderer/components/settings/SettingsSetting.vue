<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useSlots } from "vue";

import BaseChip from "../BaseChip.vue";
import BaseTooltip from "../BaseTooltip.vue";
import BaseKeyboardButton from "../input/BaseKeyboardButton.vue";
import TitleSubtitle from "../v2/TitleSubtitle.vue";
defineProps<{subsetting?:boolean, title: string, shortcuts?: string[], description?: string, info?: string, warning?:string, icon: string }>();

const slots = useSlots();

const hasSubsetting = () => {
  return slots.subsettings && slots.subsettings().length > 0;
};

</script>
 
<template>
  <div
    class="rounded-8px  gap-2 w-full text-text-title  duration-user-defined"
    :class="[subsetting ? 'bg-settings-subsetting-background hover:bg-black hover:bg-settings-subsetting-background/20' : 'bg-settings-setting-background hover:bg-surface-700 ']"
  >
    <div
      class="flex gap-4 items-center min-h-52px px-4 "
      :class="[hasSubsetting() ? 'pt-2' : 'py-1']"
    >
      <icon
        :icon="icon"
        class="w-5 h-5 min-w-5 min-h-5"
      />
      <title-subtitle
        :title="title"
        :subtitle="description"
        :info="info"
        class="whitespace-normal"
      />

      <div class="flex-1" />
      <base-chip
        v-if="warning"
        color="alert-color"
      >
        {{ warning }}
      </base-chip>
      <base-tooltip
        v-if="shortcuts"
        text="Shortcut"
        placement="top"
      >
        <base-keyboard-button
          v-for="(shortcut) of shortcuts"
          :key="shortcut"
          :button="shortcut"
        >
          {{ shortcut }}
        </base-keyboard-button>
      </base-tooltip>

      <slot />
    </div>
    <slot
      name="subsettings"
    />
  </div>
</template>
