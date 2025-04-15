<script setup lang="ts">
import { amethyst } from "@/amethyst";
import BaseChip from "@/components/BaseChip.vue";
import ButtonInput from "@/components/v2/ButtonInput.vue";
import SettingsSetting from "@/components/v2/SettingsSetting.vue";

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
      v-if="amethyst.mediaSourceManager.mediaSources.value.length > 0"
      #subsettings
    >
      <div class="p-2 flex flex-col gap-2">
        <settings-setting
          v-for="source of amethyst.mediaSourceManager.mediaSources.value"
          :key="source.path"
          subsetting
          :title="source.name"
          :description="$t(source.type)"
          icon="ic:twotone-snippet-folder"
        >
          <base-chip>
            {{ source.totalTracks }} Tracks
          </base-chip>
          <button-input
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
</template>

<style scoped lang="postcss">

</style>