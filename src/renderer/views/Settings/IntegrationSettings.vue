<script setup lang="ts">
import { amethyst } from "@/amethyst.js";
import SettingsSetting from "@/components/settings/SettingsSetting.vue";
import ToggleSwitch from "@/components/v2/ToggleSwitch.vue";
const {integrations} = amethyst.state.settings;

</script>

<template>
  <settings-setting
    title="Discord Rich Presence (RPC)"
    :description="$t('settings.discord_rpc.description')"
    :platforms="['desktop']"
    icon="ic:twotone-discord"
  >
    <toggle-switch v-model="integrations.discord.enabled" />
  </settings-setting>
  
  <settings-setting
    title="Last.fm"
    :description="$t('settings.lastfm.description')"
    icon="tabler:brand-lastfm"
  >
    <toggle-switch v-model="integrations.lastFm.enabled" />

    <template v-if="integrations.lastFm.enabled" #subsettings>
      <div class="p-2 flex flex-col gap-2">
        <settings-setting
          :title="$t('settings.lastfm.username.title')"
          :description="$t('settings.lastfm.username.description')"
          subsetting
          icon="ic:baseline-account-circle"
        >
          <input
            v-model="integrations.lastFm.username"
            type="text"
            class="input"
            :placeholder="$t('settings.lastfm.username.placeholder')"
          />
        </settings-setting>
        <settings-setting
          :title="$t('settings.lastfm.api_key.title')"
          :description="$t('settings.lastfm.api_key.description')"
          subsetting
          icon="ic:baseline-key"

        >
          <input
            v-model="integrations.lastFm.apiKey"
            type="text"
            class="input"
            :placeholder="$t('settings.lastfm.api_key.placeholder')"
          />
        </settings-setting>
        <settings-setting
          :title="$t('settings.lastfm.api_secret.title')"
          :description="$t('settings.lastfm.api_secret.description')"
          subsetting
          icon="ic:baseline-key"
        >
          <input
            v-model="integrations.lastFm.apiSecret"
            type="text"
            class="input"
            :placeholder="$t('settings.lastfm.api_secret.placeholder')"
          />
        </settings-setting>
      </div>
    </template>
  </settings-setting>
</template>

<style scoped>
input {
  @apply bg-surface-600 max-w-48 w-full text-12px p-2 rounded-4px text-ellipsis;
}

input::placeholder {
  @apply text-text-title/50 text-12px;
}

</style>