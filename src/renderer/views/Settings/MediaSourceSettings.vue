<script setup lang="ts">
import { amethyst } from "@/amethyst.js";
import BaseChip from "@/components/BaseChip.vue";
import BaseInput from "@/components/BaseInput.vue";
import SettingsSetting from "@/components/settings/SettingsSetting.vue";
import ButtonInput from "@/components/v2/ButtonInput.vue";
import { MediaSourceType } from "@/logic/MediaSource";
import { LocalMediaSource } from "@/logic/MediaSource/LocalMediaSource";
import { SubsonicMediaSource } from "@/logic/MediaSource/SubsonicMediaSource";
</script>

<template>
  <settings-setting
    :title="$t('settings.local_sources.title')"
    :description="$t('settings.local_sources.description')"
    icon="ic:twotone-folder"
  >
    <button-input
      :text="$t('settings.local_sources.add_folder')"
      icon="ic:twotone-plus"
      @click="amethyst.mediaSourceManager.addLocalSource"
    />
    <template
      v-if="amethyst.mediaSourceManager.mediaSources.value.filter(s => s instanceof LocalMediaSource).length > 0"
      #subsettings
    >
      <div class="p-2 flex flex-col gap-2">
        <settings-setting
          v-for="source of amethyst.mediaSourceManager.mediaSources.value.filter(s => s instanceof LocalMediaSource)"
          :key="source.path"
          subsetting
          :title="source.name"
          :description="$t(source.type)"
          icon="ic:twotone-snippet-folder"
        >
          <base-chip>
            {{ source.totalTracks }} {{ $t('settings.media_sources.tracks') }}
          </base-chip>

          <button-input
            v-if="amethyst.getCurrentPlatform() == 'desktop'"
            :text="$t('settings.local_sources.view')"
            icon="ic:twotone-remove-red-eye"
            @click="amethyst.showItem(source.path)"
          />
          <button-input
            icon="ic:twotone-delete"
            @click="amethyst.mediaSourceManager.removeMediaSource(source)"
          />
        </settings-setting>
      </div>
    </template>
  </settings-setting>

  <settings-setting
    :title="$t('settings.subsonic.title')"
    :description="$t('settings.subsonic.description')"
    icon="tabler:submarine"
  >
    <button-input
      :text="$t('settings.subsonic.sync_all')"
      icon="ic:twotone-sync"
      @click="amethyst.mediaSourceManager.mediaSources.value.forEach(source => { if (source instanceof SubsonicMediaSource) { source.sync(); } })"
    />

    <button-input
      v-if=" amethyst.mediaSourceManager.mediaSources.value.filter(source => source instanceof SubsonicMediaSource && source.isSyncing).length > 0 "
      :text="$t('settings.subsonic.stop_all_syncs')"
      icon="ic:twotone-cancel"
      @click="amethyst.mediaSourceManager.mediaSources.value.forEach(source => { if (source instanceof SubsonicMediaSource) { source.stopSync(); } })"
    />

    <button-input
      :text="$t('settings.subsonic.add_server')"
      icon="ic:twotone-plus"
      @click="amethyst.mediaSourceManager.addSubsonicSource('http://xnet-unraid.local:4533', 'admin', 'admin')"
    />
    <button-input
      :text="$t('settings.subsonic.demo')"
      icon="ic:twotone-plus"
      @click="amethyst.mediaSourceManager.addSubsonicSource('https://demo.navidrome.org/', 'demo', 'demo')"
    />
    <template
      v-if="amethyst.mediaSourceManager.mediaSources.value.filter(s => s instanceof SubsonicMediaSource).length > 0"
      #subsettings
    >
      <div class="p-2 flex flex-col gap-2">
        <settings-setting
          v-for="source of amethyst.mediaSourceManager.mediaSources.value.filter(s => s instanceof SubsonicMediaSource)"
          :key="source.path"
          subsetting
          :title="source.name"
          :description="`${$t(source.type)} - ${source.serverInformation ? source.serverInformation.version : $t('settings.media_sources.unknown_version')}`"
          icon="tabler:submarine"
        >
          <base-chip :color="source.isConnected ? 'good-color' : 'warning-color'">
            {{ source.isConnected ? `${$t('settings.media_sources.connected')} - ${source.ping}ms` : $t('settings.media_sources.disconnected') }}
          </base-chip>

          <base-chip
            v-if="source.isScanning"
            icon="line-md:loading-alt-loop"
            color="warning-color"
          >
            {{ $t('settings.media_sources.server_scanning') }}
          </base-chip>

          <base-chip
            v-if="source.isSyncing"
            icon="line-md:loading-twotone-loop"
            color="alert-color"
            class="min-w-[200px] justify-start! text-ellipsis overflow-hidden"
          >
            {{ $t('settings.media_sources.syncing_library') }} <br> {{ source.syncStatus }}
          </base-chip>

          <button-input
            v-if="!source.isSyncing"
            icon="ic:twotone-sync"
            text="Sync"
            @click="source.sync()"
          />

          <button-input
            v-else
            icon="ic:twotone-cancel"
            text="Cancel sync"
            @click="source.stopSync()"
          />

          <!-- <base-input
            v-model="(source).url"
            type="url"
            :placeholder="$t('settings.media_sources.url_placeholder')"
          />

          <base-input
            v-model="source.username"
            type="username"
            :placeholder="$t('settings.media_sources.username_placeholder')"
          />

          <base-input
            v-model="source.password"
            type="password"
            :placeholder="$t('settings.media_sources.password_placeholder')"
          /> -->

          <button-input
            icon="ic:twotone-delete"
            @click="amethyst.mediaSourceManager.removeMediaSource(source)"
          />
        </settings-setting>
      </div>
    </template>
  </settings-setting>
</template>

<style scoped lang="postcss">

</style>
