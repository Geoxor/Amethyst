<script setup lang="ts">
import { useState } from "@/amethyst";
import SettingsGroup from "@/components/settings/SettingsGroup.vue";
import SettingsModifier from "@/components/settings/SettingsModifier.vue";
import {ListIcon} from "@/icons/material";

const state = useState();
</script>

<template>
  <settings-group
    text="Queue List"
    :icon="ListIcon"
  >
    <settings-modifier
      v-model="state.settings.value.processingConcurrency"
      text="Processing concurrency"
      :min="1"
      :max="32"
      :step="1"
      :def="state.defaultSettings.processingConcurrency"
    />
  </settings-group>
</template>
