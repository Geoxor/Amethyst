<script setup lang="ts">
import type { AmethystPlatforms } from "@/amethyst.js";
import BaseChip from "@/components/BaseChip.vue";

defineProps<{ text: string; description?: string; warning?: string; icon?: any; platforms?: AmethystPlatforms[] }>();
</script>

<template>
  <div class="flex flex-col select-none w-full">
    <div class="flex items-center bg-surface-800 p-3 gap-2 justify-between rounded-4px text-primary-900 hover:text-accent hover:bg-surface-700 ">
      <div class="flex gap-3 items-center ">
        <component
          :is="icon"
          v-if="icon"
          class="min-w-4 min-h-4 w-4 h-4"
        />
        <div class="flex flex-col gap-1">
          <div class="flex gap-2 items-center">
            <p class="capitalize">
              {{ text }}
            </p>
            <base-chip
              v-if="warning"
            >
              {{ warning }}
            </base-chip>
          </div>
          <p
            v-if="description"
            class="opacity-50 text-11px whitespace-pre-line"
          >
            {{ description }}
          </p>
        </div>
      </div>

      <div
        class="flex gap-2 items-center"
      >
        <slot name="main" />
      </div>
    </div>
    <div
      v-if="$slots['default']"
      class="px-3"
    >
      <div class="bg-surface-1000 p-3 flex flex-col gap-2 rounded-b-4px">
        <slot />
      </div>
    </div>
  </div>
</template>
