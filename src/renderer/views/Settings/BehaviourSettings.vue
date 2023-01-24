<script setup lang="ts">
import { useState } from "@/amethyst";
import SettingsCategorySplitter from "@/components/settings/SettingsCategorySplitter.vue";
import SettingsModifier from "@/components/settings/SettingsModifier.vue";
const state = useState();
</script>

<template>
  <settings-category-splitter text="Queue List" />
  <settings-modifier
    v-model="state.settings.processingConcurrency"
    text="Processing concurrency"
    :min="1"
    :max="32"
    :step="1"
    :def="state.defaultSettings.processingConcurrency"
  />
</template>
