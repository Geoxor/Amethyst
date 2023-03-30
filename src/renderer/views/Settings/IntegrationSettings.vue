<script setup lang="ts">
import { amethyst, useState } from "@/amethyst";
import SettingsGroup from "@/components/settings/SettingsGroup.vue";
import { DiscordIcon } from "@/icons/material";
import BaseSwitch from "@/components/input/BaseSwitch.vue";
const state = useState();
</script>

<template>
  <settings-group
    v-if="amethyst.currentPlatform === 'desktop'"
    text="Discord Rich Presence (RPC)"
    :platforms="['desktop']"
    description="The Discord Rich Presence (RPC) feature allows users to share information about their current activity on the Amethyst music app with their Discord contacts. When enabled, the RPC feature updates the user's Discord status to show the version of Amethyst, currently playing song or playlist, along with the artist and album. This feature enhances the social experience of using Amethyst and allows users to share their music preferences with friends and followers."
    :icon="DiscordIcon"
  >
    <template #main>
      <base-switch v-model="state.settings.value.useDiscordRichPresence" />
    </template>
  </settings-group>
</template>
