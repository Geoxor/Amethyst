<script setup lang="ts">
import { amethyst } from "@/amethyst";
import SettingsCategory from "@/components/settings/SettingsCategory.vue";

defineProps<{
  fullwidthMin: boolean;
}>();

</script>

<template>
  <settings-category
    :title="$t('settings.appearance.title')"
    route-name="settings.appearance"
    :active="false"
    :fullwidth-min="fullwidthMin"
    :description="$t('settings.appearance.description')"
    icon="ic:twotone-palette"
  />
  <settings-category
    route-name="settings.performance"
    :title="$t('settings.performance.title')"
    :active="false"
    :fullwidth-min="fullwidthMin"
    :description="$t('settings.performance.description')"
    icon="ic:twotone-area-chart"
  />
  <settings-category
    route-name="settings.behaviour"
    :title="$t('settings.behavior.title')"
    :active="false"
    :fullwidth-min="fullwidthMin"
    :description="$t('settings.behavior.description')"
    icon="ic:twotone-psychology"
  />
  <settings-category
    route-name="settings.metering"
    :title="$t('settings.metering.title')"
    :active="false"
    :fullwidth-min="fullwidthMin"
    :description="$t('settings.metering.description')"
    icon="ic:twotone-analytics"
  />
  <settings-category
    route-name="settings.audio"
    :title="$t('settings.audio.title')"
    :active="false"
    :fullwidth-min="fullwidthMin"
    :description="$t('settings.audio.description')"
    icon="ic:twotone-volume-up"
  />
  <settings-category
    route-name="settings.media_sources"
    :title="$t('settings.media_sources.title')"
    :active="false"
    :fullwidth-min="fullwidthMin"
    :description="$t('settings.media_sources.description')"
    icon="ic:twotone-folder"
  />
  <!-- <settings-category
    route-name="settings.keybinds"
    :title="$t('settings.keybinds.title')"
    :active="false"
    :fullwidth-min="fullwidthMin"
    :description="$t('settings.keybinds.description')"
    icon="ic:twotone-keyboard"
  /> -->
  <settings-category
    v-if="amethyst.getCurrentPlatform() == 'desktop'" 
    route-name="settings.integrations"
    :title="$t('settings.integrations.title')"
    :active="false"
    :fullwidth-min="fullwidthMin"
    :description="$t('settings.integrations.description')"
    icon="ic:twotone-data-saver-off"
  />
  <settings-category
    route-name="settings.application"
    :title="$t('settings.application.title')"
    :active="false"
    :fullwidth-min="fullwidthMin"
    :description="$t('settings.application.description')"
    icon="ic:twotone-settings-applications"
  />
</template>