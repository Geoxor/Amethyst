<script setup lang="ts">
import { amethyst } from "@/amethyst.js";
import BaseInput from "@/components/BaseInput.vue";
import SettingsSetting from "@/components/settings/SettingsSetting.vue";
import ToggleSwitch from "@/components/v2/ToggleSwitch.vue";
import BigButton from "@/components/BigButton.vue";
import {authenticateLastFm} from "@/logic/lastfm.js";
const {integrations} = amethyst.state.settings;
</script>

<template>
  <settings-setting
    title="Discord Rich Presence (RPC)"
    :description="$t('settings.discord_rpc.description')"
    :platforms="['desktop']"
    info="https://discord.com/developers/docs/rich-presence/overview"
    icon="ic:twotone-discord"
    icon-color="#5865F2"
  >
    <toggle-switch v-model="integrations.discord.enabled" />
  </settings-setting>
  
  <settings-setting
    title="Last.fm"
    info="https://www.last.fm/about/trackmymusic"
    :description="$t('settings.lastfm.description')"
    icon="tabler:brand-lastfm"
    icon-color="#c71d23"
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
          <base-input
            v-model="integrations.lastFm.username"
            type="text"
            :placeholder="$t('settings.lastfm.username.placeholder')"
          />
        </settings-setting>
        <settings-setting
          :title="$t('settings.lastfm.password.title')"
          :description="$t('settings.lastfm.password.description')"
          subsetting
          icon="ic:baseline-key"

        >
          <base-input
            v-model="integrations.lastFm.password"
            type="text"
            :placeholder="$t('settings.lastfm.password.placeholder')"
          />
        </settings-setting>
        <settings-setting
            :title="$t('settings.lastfm.password.title')"
            :description="$t('settings.lastfm.password.description')"
            subsetting
            icon="ic:baseline-key"

        >
          <big-button title="EAX" description="efex" @click="authenticateLastFm()"/>
        </settings-setting>
        <settings-setting
          :title="$t('settings.lastfm.enable_scrobbling.title')"
          :description="$t('settings.lastfm.enable_scrobbling.description')"
          subsetting
          icon="ic:twotone-check-circle"
        >
          <toggle-switch v-model="integrations.lastFm.enableScrobbling" />
        </settings-setting>
      </div>
    </template>
  </settings-setting>
</template>
