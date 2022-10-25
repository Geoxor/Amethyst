<script lang="ts" setup>
import { useElectron, usePlayer, useState } from "@/amethyst";
import ControlButtons from "@/components/ControlButtons.vue";
import Menu from "@/components/menu/Menu.vue";
import MenuOption from "@/components/menu/MenuOption.vue";
import MenuSplitter from "@/components/menu/MenuSplitter.vue";
import ProcessorUsageMeter from "@/components/ProcessorUsageMeter.vue";
import { bytesToHuman } from '@/logic/formating';
const state = useState();
const electron = useElectron();
const player = usePlayer();

</script>

<template>
  <div class="borderBottom z-100 font-main drag text-12px select-none flex justify-between items-center">
    <div class="flex no-drag h-full items-center">
      <div class="logo px-2.25 cursor-heart-pointer">
        <img src="../../icon.svg">
      </div>
      <Menu title="File">
        <menu-option :shortcuts="['CTRL', 'O']" title="Open audio..." @click="() => electron.openFileDialog()" />
        <menu-option :shortcuts="['CTRL', 'SHIFT', 'O']" title="Open folder..."
          @click="() => electron.openFolderDialog()" />
        <menu-splitter />
        <menu-option :shortcuts="['CTRL', 'SHIFT', 'X']" title="Clear Queue" @click="player.clearQueue()" />
      </Menu>
      <Menu title="Utility">
        <menu-option :shortcuts="['CTRL', 'D', '+', 'X']"
          :title="`Clear cover art cache (${bytesToHuman(state.coverArtCacheSize.value)})`"
          @click="state.state.coverCache = {}" />
        <menu-option :shortcuts="['CTRL', 'D', '+', 'F']"
          :title="`Clear Waveform cache (${bytesToHuman(state.waveformCacheSize.value)})`"
          @click="state.state.waveformCache = {}" />
        <menu-option :title="`Check for updates`" @click="electron.invoke('check-for-updates')" />
      </Menu>
      <Menu title="Debug" v-if="state.isDev.value">
        <menu-option title="Set 'updateReady' to 'true'" @click="state.state.updateReady = true;" />
        <menu-option title="Set 'updateReady' to 'false'" @click="state.state.updateReady = false;" />
        <menu-splitter />
        <menu-option title="Test 'UpdateInstallingNotification'"
          @click="electron.invoke('test-notification', ['showUpdateInstallingNotification'])" />
        <menu-option title="Test 'UpdateAvailableNotification'"
          @click="electron.invoke('test-notification', ['showUpdateAvailableNotification'])" />
      </Menu>
    </div>

    <p class="">
      Amethyst v{{ state.state.version }}
    </p>


    <div class="flex gap-2 items-center overflow-hidden font-aseprite">
      <button @click="electron.close()" v-if="state.state.updateReady"
        class="no-drag py-1 px-2 cursor-pointer bg-green-900 bg-opacity-50 text-green-400 hover:bg-green-400 active:text-black hover:text-black active:bg-primary-900">INSTALL
        UPDATE</button>
      <processor-usage-meter />
      <control-buttons />
    </div>

  </div>
</template>

<style lang="postcss">
select::-ms-expand {
  display: none;
}

.logo img {
  @apply transform active: rotate-360 active:scale-50 transition duration-200 ml-1 h-4;
}
</style>
