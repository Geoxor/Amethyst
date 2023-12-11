<script setup lang="ts">
import { amethyst, useState } from "@/amethyst";
import SettingsSetting from "@/components/v2/SettingsSetting.vue";
import ToggleSwitch from "@/components/v2/ToggleSwitch.vue";
import { DiscordIcon } from "@/icons";
const state = useState();

</script>

<template>
  <settings-setting
    v-if="amethyst.getCurrentPlatform() === 'desktop'"
    title="Discord Rich Presence (RPC)"
    :description="$t('settings.discord_rpc.description')"
    :platforms="['desktop']"
    :icon="DiscordIcon"
  >
    <toggle-switch v-model="state.settings.value.useDiscordRichPresence" />
  </settings-setting>
</template>
