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
    :platforms="['desktop']"
    description="Discord Rich Presence allows users to share their current activity on Amethyst with Discord. When enabled, the RPC feature updates the user's Discord status to show the version of Amethyst, currently playing song or playlist, along with the artist and album"
    :icon="DiscordIcon"
  >
    <toggle-switch v-model="state.settings.value.useDiscordRichPresence" />
  </settings-setting>
</template>
