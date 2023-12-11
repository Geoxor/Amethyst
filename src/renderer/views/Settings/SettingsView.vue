<script setup lang="ts">
import SettingsNavigation from "@/components/v2/SettingsNavigation.vue";
</script>

<template>
  <div class="h-full flex w-ful p-2">
    <SettingsNavigation />
    <div class="flex flex-col px-2 gap-2 w-full h-full overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>
