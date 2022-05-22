<script lang="ts" setup>
import { isDev, useState } from "../state";
import Menu from "./Menu.vue";
import MenuOption from "./MenuOption.vue";
import MenuSplitter from "./MenuSplitter.vue";
import ControlButtons from "./ControlButtons.vue";
const invoke = window.electron.ipcRenderer.invoke;
const state = useState();
const playPop = () => {
  new Audio("./sounds/pop.flac").play();
};
const localstorage = localStorage;
</script>

<template>
  <div class="bg-gray-200 font-cozette drag text-xs flex justify-between items-center">
    <div class="flex no-drag h-full items-center">
      <img v-if="isDev" src="../icon-dev.png" class="transform active:rotate-360  active:scale-50 transition duration-200 cursor-heart-pointer ml-1 h-4" alt="" @click="playPop">
      <img v-else src="../icon.png" class="transform  active:rotate-360 active:scale-50 transition duration-200 cursor-heart-pointer ml-1 h-4" alt="" @click="playPop">

      <Menu title="File">
        <menu-option
          :shortcuts="['CTRL', 'O']"
          title="Open audio..."
          @click="() => invoke('open-file-dialog')"
        />
        <menu-option
          :shortcuts="['CTRL', 'SHIFT', 'O']"
          title="Open folder..."
          @click="() => invoke('open-folder-dialog')"
        />
        <menu-splitter />
        <menu-option
          :shortcuts="['CTRL', 'SHIFT', 'X']"
          title="Clear Queue"
          @click="state.queue = []"
        />
      </Menu>

      <Menu title="Settings">
        <menu-option
          :shortcuts="['CTRL', ',']"
          title="Preferences..."
        />
        <menu-splitter />
        <menu-option
          :shortcuts="['CTRL', 'D', '+', 'X']"
          title="Clear cover art cache"
          @click="localstorage.clear()"
        />
      </Menu>

      <Menu title="Help">
        <menu-option hint="Opens the Amethyst documentation on the internet" title="Documentation..." @click="() => { }" />
      </Menu>
    </div>

    Amethyst v{{ state.version }}

    <control-buttons />
  </div>
</template>

<style lang="postcss">
select::-ms-expand {
  display: none;
}
</style>
