<script setup lang="ts">
import { useState } from "@/amethyst";
import {ProcessIcon} from "@/icons/material";
import BaseSwitch from "@/components/input/BaseSwitch.vue";
import SettingsGroup from "@/components/settings/SettingsGroup.vue";

const state = useState();
</script>

<template>
  <settings-group
    :icon="ProcessIcon"
    description="Constrain the user interface (UI) framerate of Amethyst to the refresh rate of the active display."
    text="VSync"
    warning="Restart Required"
  >
    <template #main>
      <base-switch
        v-model="state.settings.useVsync" 
        @change="useElectron().ipc.invoke('set-vsync', [state.settings.useVsync])"
      />
    </template>
  </settings-group>
</template>
