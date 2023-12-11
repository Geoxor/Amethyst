<script setup lang="ts">
import { amethyst, useState } from "@/amethyst";
import {RocketIcon, UpdateIcon} from "@/icons";
import ToggleSwitch from "@/components/v2/ToggleSwitch.vue";
import SettingsSetting from "@/components/v2/SettingsSetting.vue";

const state = useState();
const handleToggleAutoUpdates = () => {
  window.electron.ipcRenderer.invoke("set-autoupdates", [state.settings.value.autoUpdatesEnabled]);
};
const handleToggleAutostart = () => {
  window.electron.ipcRenderer.invoke("set-autostart", [state.settings.value.autoStart]);
};
</script>

<template>
  <settings-setting
    v-if="amethyst.getCurrentPlatform() === 'desktop'"
    :icon="UpdateIcon"
    description="Automatically check and install updates on startup"
    title="Automatic updates"
  >
    <toggle-switch
      v-model="state.settings.value.autoUpdatesEnabled" 
      @change="handleToggleAutoUpdates"
    />
  </settings-setting>
  <settings-setting
    v-if="amethyst.getCurrentPlatform() === 'desktop'"
    :icon="RocketIcon"
    description="Launch Amethyst when your system starts"
    title="Launch on startup"
  >
    <toggle-switch
      v-model="state.settings.value.autoStart" 
      @change="handleToggleAutostart"
    />
  </settings-setting>
</template>
