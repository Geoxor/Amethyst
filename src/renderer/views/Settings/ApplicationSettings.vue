<script setup lang="ts">
import { amethyst, useState } from "@/amethyst";
import {AmethystIcon} from "@/icons";
import ToggleSwitch from "@/components/v2/ToggleSwitch.vue";
import SettingsSetting from "@/components/v2/SettingsSetting.vue";

const state = useState();
const handleToggleAutoUpdates = () => {
  window.electron.ipcRenderer.invoke("set-autoupdates", [state.settings.value.autoUpdatesEnabled]);
};
</script>

<template>
  <settings-setting
    v-if="amethyst.getCurrentPlatform() === 'desktop'"
    :icon="AmethystIcon"
    description="Automatically check and install updates on startup"
    title="Automatic updates"
  >
    <toggle-switch
      v-model="state.settings.value.autoUpdatesEnabled" 
      @change="handleToggleAutoUpdates"
    />
  </settings-setting>
</template>
