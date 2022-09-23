<template>
  <div class="flex items-center gap-2 text-[#505050]">
    <p>{{ text }}</p>
    <settings-splitter />
    <component v-if="icon" :is="icon" class="min-w-4" />
    <brush v-else class="min-w-4" />
  </div>
</template>

<script setup lang="ts">
import Brush from '../../icons/BrushIcon.vue';
import SettingsSplitter from './SettingsSplitter.vue';
defineProps<{ text: string, icon?: any }>();
</script>
