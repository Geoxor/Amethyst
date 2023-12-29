<script setup lang="ts">
import SettingsNavigation from "@/components/v2/SettingsNavigation.vue";
</script>

<template>
  <div class="h-full flex w-ful p-2 settingsView">
    <settings-navigation />
    <div class="flex flex-col px-2 gap-2 pb-64 w-full h-full overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>

<style lang="postcss">
.settingsView .slider {
  @apply w-48;
}
</style>