<script setup lang="ts">
import { amethyst } from "@/amethyst";
import SettingsSetting from "@/components/settings/SettingsSetting.vue";
import ToggleSwitch from "@/components/v2/ToggleSwitch.vue";
</script>

<template>
  <settings-setting
    icon="mdi:flask"
    :description="$t('settings.fetch_metadata_on_startup.description')"
    :title="$t('settings.fetch_metadata_on_startup.title')"
  >
    <toggle-switch
      v-model="amethyst.state.settings.value.fetchMetadataOnStartup" 
    />
  </settings-setting>
  <settings-setting
    icon="mdi:play"
    :description="$t('settings.autoplay_on_startup.description')"
    :title="$t('settings.autoplay_on_startup.title')"
  >
    <toggle-switch
      v-model="amethyst.state.settings.value.autoPlayOnStartup" 
    />
  </settings-setting>
</template>

<style scoped lang="postcss">

</style>