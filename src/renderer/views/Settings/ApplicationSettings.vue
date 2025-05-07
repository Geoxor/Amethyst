<script setup lang="ts">
import { amethyst } from "@/amethyst";
import SettingsSetting from "@/components/settings/SettingsSetting.vue";
import ButtonInput from "@/components/v2/ButtonInput.vue";
import LanguageDropdown from "@/components/v2/LanguageDropdown.vue";
import ToggleSwitch from "@/components/v2/ToggleSwitch.vue";

const handleToggleAutoUpdates = () => {
  window.electron.ipcRenderer.invoke("set-autoupdates", [application.autoUpdatesEnabled]);
};

const handleToggleAutostart = () => {
  window.electron.ipcRenderer.invoke("set-autostart", [application.autoStart]);
};

const handleLanguageChange = () => {
  window.electron.ipcRenderer.invoke("set-language", [application.language]);
};

const {application} = amethyst.state.settings.value;

</script>

<template>
  <settings-setting
    v-if="amethyst.getCurrentPlatform() === 'desktop'"
    icon="ic:twotone-update"
    :title="$t('settings.auto_update.title')"
    :description="$t('settings.auto_update.description')"
  >
    <toggle-switch
      v-model="application.autoUpdatesEnabled" 
      @change="handleToggleAutoUpdates"
    />
  </settings-setting>
  <settings-setting
    v-if="amethyst.getCurrentPlatform() === 'desktop'"
    :title="$t('settings.launch_on_startup.title')"
    :description="$t('settings.launch_on_startup.description')"
    icon="ic:twotone-rocket-launch"
  >
    <toggle-switch
      v-model="application.autoStart" 
      @change="handleToggleAutostart"
    />
  </settings-setting>

  <settings-setting
    icon="ic:twotone-language"
    :title="$t('settings.language.title')"
    :description="$t('settings.language.description')"
  >
    <language-dropdown 
      @change="handleLanguageChange"
    />
  </settings-setting>
  <settings-setting
    icon="ic:twotone-file-upload"
    :title="$t('settings.import_export.title')"
    :description="$t('settings.import_export.description')"
  >
    <button-input
      :text="$t('settings.import_export.import')"
      icon="ic:twotone-file-download"
      @click="amethyst.importSettings"
    />
    <button-input
      :text="$t('settings.import_export.export')"
      icon="ic:twotone-file-upload"
      @click="amethyst.exportSettings"
    />
  </settings-setting>
  <settings-setting
    icon="ic:twotone-delete"
    :title="$t('settings.reset.title')"
    :description="$t('settings.reset.description')"
  >
    <button-input
      :text="$t('settings.reset.reset')"
      icon="ic:twotone-delete"
      @click="amethyst.resetSettings"
    />
  </settings-setting>
</template>
