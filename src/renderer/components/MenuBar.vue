<script lang="ts" setup>
import Menu from "./Menu.vue";
import MenuOption from "./MenuOption.vue";
// import MenuSplitter from "./MenuSplitter.vue";
import ControlButtons from "./ControlButtons.vue";
const invoke = window.electron.ipcRenderer.invoke;
</script>

<template>
  <div class="bg-gray-200 font-fredoka drag text-xs flex justify-between items-center">
    <div class="flex h-full items-center">
      <img src="../icon.png" class="ml-1 h-4" alt="">

      <Menu title="File">
        <menu-option
          hint="Open an audio file"
          :shortcuts="['CTRL', 'O']"
          title="Open..."
          @click="() => invoke('open-file-dialog')"
        />
      </Menu>

      <Menu title="Settings">
        <menu-option
          hint="Opens the settings menu"
          :shortcuts="['CTRL', ',']"
          title="Preferences..."
        />
      </Menu>

      <Menu title="Help">
        <menu-option hint="Opens the Amethyst documentation on the internet" title="Documentation..." @click="() => { }" />
      </Menu>
    </div>

    <control-buttons />
  </div>
</template>

<style lang="postcss">
select::-ms-expand {
  display: none;
}
</style>
