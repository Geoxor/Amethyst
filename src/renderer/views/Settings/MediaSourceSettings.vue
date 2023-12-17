<script setup lang="ts">
import { AddIcon, EyeIcon, FolderIcon, RemoveIcon } from "@/icons";
import SettingsSetting from "@/components/v2/SettingsSetting.vue";
import { amethyst } from "@/amethyst";
import ButtonInput from "@/components/v2/ButtonInput.vue";
import BaseChip from "@/components/BaseChip.vue";

</script>

<template>
  <settings-setting
    :title="$t('settings.local_sources.title')"
    :description="$t('settings.local_sources.description')"
    :icon="FolderIcon"
  >
    <button-input
      :text="$t('settings.local_sources.add_folder')"
      :icon="AddIcon"
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
          :icon="FolderIcon"
        >
          <base-chip>
            {{ source.totalTracks }} Tracks
          </base-chip>
          <button-input
            :text="$t('settings.local_sources.open_explorer')"
            :icon="EyeIcon"
            @click="amethyst.showItem(source.path)"
          />
          <button-input
            :icon="RemoveIcon"
            @click="amethyst.mediaSourceManager.removeMediaSource(source)"
          />
        </settings-setting>
      </div>
    </template>
  </settings-setting>
</template>

<style scoped lang="postcss">

</style>