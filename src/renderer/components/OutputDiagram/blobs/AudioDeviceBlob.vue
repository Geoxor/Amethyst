<script setup lang="ts">
import { amethyst } from "@/amethyst";
import AlsaLogo from "@/icons/logos/AlsaLogo.vue";
import AppleLogo from "@/icons/logos/AppleLogo.vue";
import ArturiaLogo from "@/icons/logos/ArturiaLogo.vue";
import AsioLogo from "@/icons/logos/AsioLogo.vue";
import BluetoothLogo from "@/icons/logos/BluetoothLogo.vue";
import FLStudioLogo from "@/icons/logos/FLStudioLogo.vue";
import FocusriteLogo from "@/icons/logos/FocusriteLogo.vue";
import MoondropLogo from "@/icons/logos/MoondropLogo.vue";
import NvidiaLogo from "@/icons/logos/NvidiaLogo.vue";
import RealtekLogo from "@/icons/logos/RealtekLogo.vue";
import SoundIDLogo from "@/icons/logos/SoundIDLogo.vue";
import SteamLogo from "@/icons/logos/SteamLogo.vue";
import { useRouter } from "vue-router";
import BlobLine from "./BlobLine.vue";
import GenericBlob from "./GenericBlob.vue";
const router = useRouter();

const {outputDeviceName} = amethyst.state.settings.value.audio;
const outputDeviceNameLowerCase = outputDeviceName.toLowerCase();
</script>

<template>
  <generic-blob
    :title="$t('output_diagram.audio_device.title')"
    :subtitle="amethyst.state.settings.value.audio.driver != 'default' ? `${outputDeviceName}\n${amethyst.state.settings.value.audio.bufferSize}smp` : outputDeviceName"
    clickable
    @click="router.push({ name: 'settings.audio' })"
  >
    <sound-i-d-logo v-if="outputDeviceNameLowerCase.includes('soundid')" />
    <realtek-logo v-else-if="outputDeviceNameLowerCase.includes('realtek')" />
    <steam-logo v-else-if="outputDeviceNameLowerCase.includes('steam')" />
    <focusrite-logo v-else-if="outputDeviceNameLowerCase.includes('focusrite')" />
    <alsa-logo v-else-if="outputDeviceNameLowerCase.includes('alsa')" />
    <arturia-logo v-else-if="['minifuse', 'arturia'].some(string => outputDeviceNameLowerCase.includes(string))" />
    <nvidia-logo v-else-if="outputDeviceNameLowerCase.includes('nvidia')" />
    <moondrop-logo v-else-if="outputDeviceNameLowerCase.includes('moondrop')" />
    <f-l-studio-logo v-else-if="outputDeviceNameLowerCase.includes('fl studio')" />
    <apple-logo v-else-if="['apple inc.'].some(string => outputDeviceNameLowerCase.includes(string))" />
        
    <!-- asio last incase we don't recognise the company of the specific asio device -->
    <bluetooth-logo v-else-if="outputDeviceNameLowerCase.includes('bluetooth')" />
    <asio-logo v-else-if="outputDeviceNameLowerCase.includes('asio')" />
    <icon
      v-else
      icon="ic:twotone-volume-up" 
      class="h-6 w-6 "
    />
  </generic-blob>
  <blob-line />
</template>
