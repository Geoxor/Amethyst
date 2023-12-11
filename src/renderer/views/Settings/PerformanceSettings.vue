<script setup lang="ts">
import { amethyst, useState } from "@/amethyst";
import { MonitorIcon} from "@/icons";
import ToggleSwitch from "@/components/v2/ToggleSwitch.vue";
import SettingsSetting from "@/components/v2/SettingsSetting.vue";

const state = useState();
const handleToggleVsync = () => {
  window.electron.ipcRenderer.invoke("set-vsync", [state.settings.value.useVsync]);
};

</script>

<template>
  <settings-setting
    v-if="amethyst.getCurrentPlatform() === 'desktop'"
    :icon="MonitorIcon"
    :description="$t('settings.vsync.description')"
    :title="$t('settings.vsync.title')"
    :warning="$t('settings.vsync.warning')"
    :platforms="['desktop']"
  >
    <toggle-switch
      v-model="state.settings.value.useVsync" 
      @change="handleToggleVsync"
    />
  </settings-setting>
</template>