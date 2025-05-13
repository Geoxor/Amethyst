<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";

import { amethyst } from "@/amethyst.js";
import AlsaLogo from "@/icons/logos/AlsaLogo.vue";
import AppleLogo from "@/icons/logos/AppleLogo.vue";
import ArturiaLogo from "@/icons/logos/ArturiaLogo.vue";
import AsioLogo from "@/icons/logos/AsioLogo.vue";
import BluetoothLogo from "@/icons/logos/BluetoothLogo.vue";
import ConexantLogo from "@/icons/logos/ConexantLogo.vue";
import DunuLogo from "@/icons/logos/DunuLogo.vue";
import FiioLogo from "@/icons/logos/FiioLogo.vue";
import FLStudioLogo from "@/icons/logos/FLStudioLogo.vue";
import FocusriteLogo from "@/icons/logos/FocusriteLogo.vue";
import JcallyLogo from "@/icons/logos/JcallyLogo.vue";
import MoondropLogo from "@/icons/logos/MoondropLogo.vue";
import NvidiaLogo from "@/icons/logos/NvidiaLogo.vue";
import RealtekLogo from "@/icons/logos/RealtekLogo.vue";
import SoundIDLogo from "@/icons/logos/SoundIDLogo.vue";
import SteamLogo from "@/icons/logos/SteamLogo.vue";
import TanchjimLogo from "@/icons/logos/TanchjimLogo.vue";

import BlobLine from "./BlobLine.vue";
import GenericBlob from "./GenericBlob.vue";
const router = useRouter();

</script>

<template>
  <generic-blob
    :title="$t('output_diagram.audio_device.title')"
    :subtitle="amethyst.state.settings.audio.driver != 'default' ? `${amethyst.state.settings.audio.outputDeviceName}\n${amethyst.state.settings.audio.bufferSize}smp` : amethyst.state.settings.audio.outputDeviceName"
    clickable
    @click="router.push({ name: 'settings.audio' })"
  >
    <sound-i-d-logo v-if="amethyst.state.settings.audio.outputDeviceName.toLowerCase().includes('soundid')" />
    <realtek-logo v-else-if="amethyst.state.settings.audio.outputDeviceName.toLowerCase().includes('realtek')" />
    <steam-logo v-else-if="amethyst.state.settings.audio.outputDeviceName.toLowerCase().includes('steam')" />
    <focusrite-logo v-else-if="amethyst.state.settings.audio.outputDeviceName.toLowerCase().includes('focusrite')" />
    <alsa-logo v-else-if="amethyst.state.settings.audio.outputDeviceName.toLowerCase().includes('alsa')" />
    <dunu-logo v-else-if="['dtc 500', 'dtc 480', 'dtc 800'].some(string => amethyst.state.settings.audio.outputDeviceName.toLowerCase().includes(string))" />
    <conexant-logo v-else-if="['cx31993'].some(string => amethyst.state.settings.audio.outputDeviceName.toLowerCase().includes(string))" />
    <fiio-logo v-else-if="['jadeaudio'].some(string => amethyst.state.settings.audio.outputDeviceName.toLowerCase().includes(string))" />
    <tanchjim-logo v-else-if="['tanchjim'].some(string => amethyst.state.settings.audio.outputDeviceName.toLowerCase().includes(string))" />
    <jcally-logo v-else-if="['jcally'].some(string => amethyst.state.settings.audio.outputDeviceName.toLowerCase().includes(string))" />
    <arturia-logo v-else-if="['minifuse', 'arturia'].some(string => amethyst.state.settings.audio.outputDeviceName.toLowerCase().includes(string))" />
      
    <nvidia-logo v-else-if="amethyst.state.settings.audio.outputDeviceName.toLowerCase().includes('nvidia')" />
    <moondrop-logo v-else-if="amethyst.state.settings.audio.outputDeviceName.toLowerCase().includes('moondrop')" />
    <f-l-studio-logo v-else-if="amethyst.state.settings.audio.outputDeviceName.toLowerCase().includes('fl studio')" />
    <apple-logo v-else-if="['apple inc.', 'usb-c to 3.5mm headphone jack adapter'].some(string => amethyst.state.settings.audio.outputDeviceName.toLowerCase().includes(string))" />
        
    <!-- asio last incase we don't recognise the company of the specific asio device -->
    <bluetooth-logo v-else-if="amethyst.state.settings.audio.outputDeviceName.toLowerCase().includes('bluetooth')" />
    <asio-logo v-else-if="amethyst.state.settings.audio.outputDeviceName.toLowerCase().includes('asio')" />
    <icon
      v-else
      icon="ic:twotone-volume-up" 
      class="h-6 w-6 "
    />
  </generic-blob>
  <blob-line />
</template>
