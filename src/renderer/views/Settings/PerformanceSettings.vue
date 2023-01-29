<script setup lang="ts">
import { useElectron, useState } from "@/amethyst";
import SettingsBinarySwitch from "@/components/settings/SettingsBinarySwitch.vue";

const state = useState();
</script>

<template>
  <div>
    <settings-binary-switch
      v-model="state.settings.useVsync"
      text="VSync"
      @change="useElectron().ipc.invoke('set-vsync', [state.settings.useVsync])"
    />
  </div>
</template>

<style scoped lang="postcss">

</style>