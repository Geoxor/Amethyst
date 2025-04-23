<script setup lang="ts">
import { amethyst } from "@/amethyst";
import SettingsSetting from "@/components/settings/SettingsSetting.vue";
import ToggleSwitch from "@/components/v2/ToggleSwitch.vue";

</script>

<template>
  <settings-setting
    v-if="amethyst.getCurrentPlatform() === 'desktop'"
    title="Discord Rich Presence (RPC)"
    :description="$t('settings.discord_rpc.description')"
    :platforms="['desktop']"
    icon="ic:twotone-discord"
  >
    <toggle-switch v-model="amethyst.state.settings.value.useDiscordRichPresence" />
  </settings-setting>
</template>
