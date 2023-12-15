<script setup lang="ts">
import { amethyst, useState } from "@/amethyst";
import {ExportIcon, ImportIcon, LanguageIcon, RocketIcon, UpdateIcon} from "@/icons";
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

const importSettings = async () => {
  const dialog = await amethyst.showOpenFileDialog({
    filters: [{ name: "Amethyst Configuration File", extensions: ["acf"] }],
    defaultPath: "Amethyst Settings",
  });

  if (dialog?.canceled || !dialog.filePaths[0]) return;

  const loadedSettings = await fetch(dialog.filePaths[0]);
  const parsedSettings = await loadedSettings.json();

  Object.keys(amethyst.store.settings.value).forEach(key => {
    // @ts-ignore
    amethyst.store.settings.value[key] = parsedSettings[key];
  });
};

const exportSettings = async () => {
  const dialog = await amethyst.showSaveFileDialog({
    filters: [{ name: "Amethyst Configuration File", extensions: ["acf"] }],
    defaultPath: "Amethyst Settings"
  });
  if (dialog?.canceled || !dialog?.filePath) return;

  return amethyst.writeFile(JSON.stringify(amethyst.store.settings.value, null, 2), dialog?.filePath);
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
      @click="importSettings"
    />
    <button-input
      :text="$t('settings.import_export.export')"
      :icon="ExportIcon"
      @click="exportSettings"
    />
  </settings-setting>
</template>
