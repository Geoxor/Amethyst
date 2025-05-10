<script setup lang="ts">
import ResizableSettingsNavigation from "@/components/v2/ResizableSettingsNavigation.vue";
</script>

<template>
  <div class="h-full flex w-ful p-2 settingsView">
    <resizable-settings-navigation />
    <div class="flex flex-col px-2 gap-2 pb-64 flex-1 h-full overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
@import "../../base.css";

.settingsView .slider {
  @apply w-48;
}
</style>