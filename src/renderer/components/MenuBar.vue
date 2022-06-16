<script lang="ts" setup>
import { bytesToHuman } from "../state";
import { useElectron, usePlayer, useState } from "../amethyst";
import Menu from "./Menu.vue";
import MenuOption from "./MenuOption.vue";
import MenuSplitter from "./MenuSplitter.vue";
import ControlButtons from "./ControlButtons.vue";
const state = useState();
const electron = useElectron();
const player = usePlayer();
const playPop = () => {
  new Audio("./sounds/pop.flac").play();
};
const openPreferences = () => {
  electron.invoke("open-preferences");
}
</script>

<template>
  <div class="bg-menu-bar font-cozette drag text-xs flex justify-between items-center">
    <div class="flex no-drag h-full items-center">
      <img v-if="state.isDev.value" src="../icon-dev.png" class="transform active:rotate-360  active:scale-50 transition duration-200 cursor-heart-pointer ml-1 h-4" alt="" @click="playPop">
      <img v-else src="../icon.png" class="transform  active:rotate-360 active:scale-50 transition duration-200 cursor-heart-pointer ml-1 h-4" alt="" @click="playPop">

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

      <Menu title="Settings">
        <menu-option
          :shortcuts="['CTRL', ',']"
          title="Preferences..."
          @click="openPreferences()"
        />
        <menu-splitter />
        <menu-option
          :shortcuts="['CTRL', 'D', '+', 'X']"
          :title="`Clear cover art cache (${bytesToHuman(state.coverArtCacheSize.value)})`"
          @click="state.state.coverCache = {}"
        />
        <menu-option
          :shortcuts="['CTRL', 'D', '+', 'F']"
          :title="`Clear BPM cache (${bytesToHuman(state.bpmCacheSize.value)})`"
          @click="state.state.bpmCache = {}"
        />
        <menu-option
          :title="`Check for updates`"
          @click="electron.invoke('check-for-updates')"
        />
      </Menu>

      <Menu title="Help">
        <menu-option hint="Opens the Amethyst documentation on the internet" title="Documentation..." @click="() => { }" />
      </Menu>
    </div>

    Amethyst v{{ state.state.version }}

    <control-buttons />
  </div>
</template>

<style lang="postcss">
select::-ms-expand {
  display: none;
}
</style>
