<script setup lang="ts">
import { useState } from "@/amethyst";
import SettingsBinarySwitch from "@/components/settings/SettingsBinarySwitch.vue";
import SettingsCategorySplitter from "@/components/settings/SettingsCategorySplitter.vue";
const state = useState();
</script>

<template>
  <settings-category-splitter text="Integrations" />
  <settings-binary-switch
    v-model="state.settings.useDiscordRichPresence"
    text="Discord Rich Presence"
  />
</template>
