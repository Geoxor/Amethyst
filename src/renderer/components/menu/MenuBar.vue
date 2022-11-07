<script lang="ts" setup>
import { useElectron, usePlayer, useState } from "@/amethyst";
import ControlButtons from "@/components/input/ControlButtons.vue";
import UpdateButton from "@/components/input/UpdateButton.vue";
import Menu from "@/components/menu/MenuContainer.vue";
import MenuOption from "@/components/menu/MenuOption.vue";
import MenuSplitter from "@/components/menu/MenuSplitter.vue";
import ProcessorUsageMeter from "@/components/ProcessorUsageMeter.vue";
import { bytesToHuman } from "@/logic/formating";
const state = useState();
const electron = useElectron();
const player = usePlayer();

</script>

<template>
  <div
    class="text-primary-900 borderBottom z-100 font-main drag text-12px select-none flex justify-between items-center"
    :class="[state.state.isFocused ? 'text-opacity-100' : 'text-opacity-50']"
  >
    <div class="flex no-drag h-full items-center">
      <div class="logo px-2.25 mr-0.5 cursor-heart-pointer">
        <img src="../../icon.svg">
      </div>
      <Menu title="File">
        <menu-option
          :shortcuts="['CTRL', 'O']"
          title="Open audio..."
          @click="() => electron.openFileDialog()"
        />
        <menu-option
          :shortcuts="['CTRL', 'SHIFT', 'O']"
          title="Open folder..."
          @click="() => electron.openFolderDialog()"
        />
        <menu-splitter />
        <menu-option
          :shortcuts="['CTRL', 'SHIFT', 'X']"
          title="Clear Queue"
          @click="player.clearQueue()"
        />
      </Menu>
      <Menu title="Utility">
        <menu-option
          :shortcuts="['CTRL', 'D', '+', 'X']"
          :title="`Clear cover art cache (${bytesToHuman(state.coverArtCacheSize.value)})`"
          @click="state.state.coverCache = {}"
        />
        <menu-option
          :shortcuts="['CTRL', 'D', '+', 'F']"
          :title="`Clear Waveform cache (${bytesToHuman(state.waveformCacheSize.value)})`"
          @click="state.state.waveformCache = {}"
        />
        <menu-option
          :title="`Check for updates`"
          @click="electron.invoke('check-for-updates')"
        />
      </Menu>
      <Menu
        v-if="state.isDev.value"
        title="Debug"
      >
        <menu-option
          title="Set 'updateReady' to 'true'"
          @click="state.state.updateReady = true;"
        />
        <menu-option
          title="Set 'updateReady' to 'false'"
          @click="state.state.updateReady = false;"
        />
        <menu-splitter />
        <menu-option
          title="Test 'UpdateInstallingNotification'"
          @click="electron.invoke('test-notification', ['showUpdateInstallingNotification'])"
        />
        <menu-option
          title="Test 'UpdateAvailableNotification'"
          @click="electron.invoke('test-notification', ['showUpdateAvailableNotification'])"
        />
      </Menu>
    </div>

    <p>
      Amethyst v{{ state.state.version }}
    </p>

    <div class="flex gap-2 items-center overflow-hidden font-aseprite">
      <update-button
        v-if="state.state.updateReady"
        @click="electron.close()"
      />
      <processor-usage-meter :value="state.state.cpuUsage" />
      <control-buttons
        :is-maximized="state.state.isMaximized"
        @close="electron.close"
        @minimize="electron.minimize"
        @maximize="electron.maximize"
        @unmaximize="electron.unmaximize"
      />
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
