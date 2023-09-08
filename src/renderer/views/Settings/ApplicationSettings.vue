<script setup lang="ts">
import { amethyst, useState } from "@/amethyst";
import {FlickerFreeIcon} from "@/icons/material";
import BaseSwitch from "@/components/input/BaseSwitch.vue";
import SettingsGroup from "@/components/settings/SettingsGroup.vue";

const state = useState();
const handleToggleAutoUpdates = () => {
  window.electron.ipcRenderer.invoke("set-autoupdates", [state.settings.value.autoUpdatesEnabled]);
};
</script>

<template>
  <settings-group
    v-if="amethyst.getCurrentPlatform() === 'desktop'"
    :icon="FlickerFreeIcon"
    description="Automatically check and install updates on startup"
    text="Automatic updates"
    :platforms="['desktop']"
  >
    <template #main>
      <base-switch
        v-model="state.settings.value.autoUpdatesEnabled" 
        @change="handleToggleAutoUpdates"
      />
    </template>
  </settings-group>
</template>
