<script setup lang="ts">
import { amethyst, useState } from "@/amethyst";
import {ExportIcon, ImportIcon, LanguageIcon, RemoveIcon, RocketIcon, UpdateIcon} from "@/icons";
import ToggleSwitch from "@/components/v2/ToggleSwitch.vue";
import SettingsSetting from "@/components/v2/SettingsSetting.vue";
import LanguageDropdown from "@/components/v2/LanguageDropdown.vue";
import ButtonInput from "@/components/v2/ButtonInput.vue";

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
    :title="$t('settings.auto_update.title')"
    :description="$t('settings.auto_update.description')"
  >
    <toggle-switch
      v-model="state.settings.value.autoUpdatesEnabled" 
      @change="handleToggleAutoUpdates"
    />
  </settings-setting>
  <settings-setting
    v-if="amethyst.getCurrentPlatform() === 'desktop'"
    :title="$t('settings.launch_on_startup.title')"
    :description="$t('settings.launch_on_startup.description')"
    :icon="RocketIcon"
  >
    <toggle-switch
      v-model="state.settings.value.autoStart" 
      @change="handleToggleAutostart"
    />
  </settings-setting>

  <settings-setting
    :icon="LanguageIcon"
    :title="$t('settings.language.title')"
    :description="$t('settings.language.description')"
  >
    <language-dropdown />
  </settings-setting>
  <settings-setting
    :icon="ExportIcon"
    :title="$t('settings.import_export.title')"
    :description="$t('settings.import_export.description')"
  >
    <button-input
      :text="$t('settings.import_export.import')"
      :icon="ImportIcon"
      @click="amethyst.importSettings"
    />
    <button-input
      :text="$t('settings.import_export.export')"
      :icon="ExportIcon"
      @click="amethyst.exportSettings"
    />
  </settings-setting>
  <settings-setting
    :icon="RemoveIcon"
    :title="$t('settings.reset.title')"
    :description="$t('settings.reset.description')"
  >
    <button-input
      :text="$t('settings.reset.reset')"
      :icon="RemoveIcon"
      @click="amethyst.resetSettings"
    />
  </settings-setting>
</template>
