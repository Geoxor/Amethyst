<script setup lang="ts">
defineProps<{ text: string, description?: string, icon?: any }>();
</script>

<template>
  <div class="flex flex-col">
    <div class="flex items-center bg-surface-800 p-3 gap-2 justify-between rounded-4px text-primary-900 hover:text-primary-800 hover:bg-surface-700 ">
      <div class="flex gap-3 items-center">
        <component
          :is="icon"
          v-if="icon"
          class="min-w-4 min-h-4 w-4 h-4"
        />
        <div class="flex flex-col gap-1">
          <p class="capitalize">
            {{ text }}
          </p>
          <p
            v-if="description"
            class="opacity-50 text-9px whitespace-pre-line"
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
      <div class="bg-surface-1000 p-3 flex flex-col gap-1 rounded-b-4px">
        <slot />
      </div>
    </div>
  </div>
</template>
