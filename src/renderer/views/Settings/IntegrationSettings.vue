<script setup lang="ts">
import { DISCORD_RPC_FIELD_OPTIONS } from "@shared/types.js";

import { amethyst } from "@/amethyst.js";
import BaseInput from "@/components/BaseInput.vue";
import SettingsSetting from "@/components/settings/SettingsSetting.vue";
import ButtonInput from "@/components/v2/ButtonInput.vue";
import DropdownInput from "@/components/v2/DropdownInput.vue";
import ToggleSwitch from "@/components/v2/ToggleSwitch.vue";
import { DEFAULT_DISCORD_CLIENT_ID, DEFAULT_DISCORD_RPC_FIELDS } from "@/logic/settings.js";

const { integrations } = amethyst.state.settings;

const FIELD_OPTIONS = [...DISCORD_RPC_FIELD_OPTIONS];
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

    <template
      v-if="integrations.discord.enabled"
      #subsettings
    >
      <div class="p-2 flex flex-col gap-2">
        <settings-setting
          :title="$t('settings.discord_rpc.client_id.title')"
          :description="$t('settings.discord_rpc.client_id.description')"
          subsetting
          icon="ic:baseline-tag"
        >
          <base-input
            v-model="integrations.discord.clientId"
            type="text"
            :placeholder="DEFAULT_DISCORD_CLIENT_ID"
          />
          <button-input
            icon="ic:twotone-restore"
            @click="integrations.discord.clientId = DEFAULT_DISCORD_CLIENT_ID"
          />
        </settings-setting>

        <settings-setting
          :title="$t('settings.discord_rpc.find_song_button.title')"
          :description="$t('settings.discord_rpc.find_song_button.description')"
          subsetting
          icon="ic:twotone-search"
        >
          <toggle-switch v-model="integrations.discord.showFindSongButton" />
        </settings-setting>

        <settings-setting
          :title="$t('settings.discord_rpc.cover_art.title')"
          :description="$t('settings.discord_rpc.cover_art.description')"
          subsetting
          icon="ic:twotone-image"
        >
          <toggle-switch v-model="integrations.discord.showCoverArt" />
        </settings-setting>

        <settings-setting
          :title="$t('settings.discord_rpc.fields.details.title')"
          :description="$t('settings.discord_rpc.fields.details.description')"
          subsetting
          icon="ic:twotone-text-fields"
        >
          <dropdown-input
            v-model="integrations.discord.fields.details"
            :options="FIELD_OPTIONS"
          />
          <button-input
            icon="ic:twotone-restore"
            @click="integrations.discord.fields.details = DEFAULT_DISCORD_RPC_FIELDS.details"
          />
        </settings-setting>
        <settings-setting
          :title="$t('settings.discord_rpc.fields.state.title')"
          :description="$t('settings.discord_rpc.fields.state.description')"
          subsetting
          icon="ic:twotone-text-fields"
        >
          <dropdown-input
            v-model="integrations.discord.fields.state"
            :options="FIELD_OPTIONS"
          />
          <button-input
            icon="ic:twotone-restore"
            @click="integrations.discord.fields.state = DEFAULT_DISCORD_RPC_FIELDS.state"
          />
        </settings-setting>
        <settings-setting
          :title="$t('settings.discord_rpc.fields.large_image_text.title')"
          :description="$t('settings.discord_rpc.fields.large_image_text.description')"
          subsetting
          icon="ic:twotone-text-fields"
        >
          <dropdown-input
            v-model="integrations.discord.fields.largeImageText"
            :options="FIELD_OPTIONS"
          />
          <button-input
            icon="ic:twotone-restore"
            @click="integrations.discord.fields.largeImageText = DEFAULT_DISCORD_RPC_FIELDS.largeImageText"
          />
        </settings-setting>
        <settings-setting
          :title="$t('settings.discord_rpc.fields.small_image_text.title')"
          :description="$t('settings.discord_rpc.fields.small_image_text.description')"
          subsetting
          icon="ic:twotone-text-fields"
        >
          <dropdown-input
            v-model="integrations.discord.fields.smallImageText"
            :options="FIELD_OPTIONS"
          />
          <button-input
            icon="ic:twotone-restore"
            @click="integrations.discord.fields.smallImageText = DEFAULT_DISCORD_RPC_FIELDS.smallImageText"
          />
        </settings-setting>
      </div>
    </template>
  </settings-setting>

  <settings-setting
    title="Last.fm"
    info="https://www.last.fm/about/trackmymusic"
    :description="$t('settings.lastfm.description')"
    icon="tabler:brand-lastfm"
    icon-color="#c71d23"
  >
    <toggle-switch v-model="integrations.lastFm.enabled" />

    <template
      v-if="integrations.lastFm.enabled"
      #subsettings
    >
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
            type="password"
            :placeholder="$t('settings.lastfm.password.placeholder')"
          />
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
