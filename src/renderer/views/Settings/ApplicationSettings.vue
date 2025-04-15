<script setup lang="ts">
import { amethyst, useState } from "@/amethyst";
import ButtonInput from "@/components/v2/ButtonInput.vue";
import LanguageDropdown from "@/components/v2/LanguageDropdown.vue";
import SettingsSetting from "@/components/v2/SettingsSetting.vue";
import ToggleSwitch from "@/components/v2/ToggleSwitch.vue";

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
    icon="ic:twotone-update"
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
    icon="ic:twotone-rocket-launch"
  >
    <toggle-switch
      v-model="state.settings.value.autoStart" 
      @change="handleToggleAutostart"
    />
  </settings-setting>

  <settings-setting
    icon="ic:twotone-language"
    :title="$t('settings.language.title')"
    :description="$t('settings.language.description')"
  >
    <language-dropdown />
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
