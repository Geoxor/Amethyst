<script setup lang="ts">
import { amethyst, useState } from "@/amethyst";
import {FlickerFreeIcon} from "@/icons/material";
import BaseSwitch from "@/components/input/BaseSwitch.vue";
import SettingsGroup from "@/components/settings/SettingsGroup.vue";

const state = useState();
const handleToggleVsync = () => {
  window.electron.ipcRenderer.invoke("set-vsync", [state.settings.value.useVsync]);
};
</script>

<template>
  <settings-group
    v-if="amethyst.getCurrentPlatform() === 'desktop'"
    :icon="FlickerFreeIcon"
    description="Constrain the user interface (UI) framerate of Amethyst to the refresh rate of the active display."
    text="VSync"
    warning="Restart Required"
    :platforms="['desktop']"
  >
    <template #main>
      <base-switch
        v-model="state.settings.value.useVsync" 
        @change="handleToggleVsync"
      />
    </template>
  </settings-group>
</template>
