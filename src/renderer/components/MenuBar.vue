<script lang="ts" setup>
import Menu from "./Menu.vue";
import MenuOption from "./MenuOption.vue";
// import MenuSplitter from "./MenuSplitter.vue";
import ControlButtons from "./ControlButtons.vue";
const invoke = window.electron.ipcRenderer.invoke;
</script>

<template>
  <div class="bg-gray-200  drag  text-xs flex justify-between items-center">
    <div class="flex h-full items-center">
      <img src="../icon.png" class="ml-1 h-4" alt="">

      <Menu title="File">
        <MenuOption
          hint="Open an audio file"
          :shortcuts="['CTRL', 'O']"
          title="Open..."
          @click="() => invoke('open-file-dialog')"
        />
      </Menu>

      <Menu title="Settings">
        <MenuOption
          hint="Opens the settings menu"
          :shortcuts="['CTRL', ',']"
          title="Preferences..."
        />
      </Menu>

      <Menu title="Help">
        <MenuOption hint="Opens the Amethyst documentation on the internet" title="Documentation..." @click="() => { }" />
      </Menu>
    </div>

    <ControlButtons />
  </div>
</template>

<style lang="postcss">
select::-ms-expand {
  display: none;
}
</style>
