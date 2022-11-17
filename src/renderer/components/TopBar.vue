<script lang="ts" setup>
import { useElectron, usePlayer, useState } from "@/amethyst";
import ControlButtons from "@/components/input/ControlButtons.vue";
import UpdateButton from "@/components/input/UpdateButton.vue";
import Menu from "@/components/menu/MenuContainer.vue";
import MenuOption from "@/components/menu/MenuOption.vue";
import MenuSplitter from "@/components/menu/MenuSplitter.vue";
import ProcessorUsageMeter from "@/components/ProcessorUsageMeter.vue";
import AudioFileIcon from "@/icons/plumpy/AudioFileIcon.vue";
import BroomIcon from "@/icons/plumpy/BroomIcon.vue";
import DiscordIcon from "@/icons/plumpy/DiscordIcon.vue";
import GitHubIcon from "@/icons/plumpy/GitHubIcon.vue";
import MusicFolderIcon from "@/icons/plumpy/MusicFolderIcon.vue";
import RestartIcon from "@/icons/plumpy/RestartIcon.vue";
import ZoomInIcon from "@/icons/plumpy/ZoomInIcon.vue";
import ZoomOutIcon from "@/icons/plumpy/ZoomOutIcon.vue";
import ZoomToExtentsIcon from "@/icons/plumpy/ZoomToExtentsIcon.vue";
import { useFps } from "@vueuse/core";
const fps = useFps({every: 30});

const state = useState();
const electron = useElectron();
const player = usePlayer();
</script>

<template>
  <div
    class="borderBottom z-100 font-main drag text-12px select-none flex justify-between items-center"
    :class="[state.state.isFocused ? 'text-primary-1000' : 'text-primary-900']"
  >
    <div class="flex no-drag h-full items-center">
      <div class="logo px-2.25 mr-0.5 cursor-heart-pointer">
        <img
          class="w-4 h-4 min-h-4 min-w-4"
          src="../icon.svg"
        >
      </div>
      <Menu title="File">
        <menu-option
          :shortcuts="['CTRL', 'O']"
          title="Open audio..."
          :icon="AudioFileIcon"
          @click="() => electron.openFileDialog()"
        />
        <menu-option
          :shortcuts="['CTRL', 'SHIFT', 'O']"
          title="Open folder..."
          :icon="MusicFolderIcon"
          @click="() => electron.openFolderDialog()"
        />
      </Menu>
      <Menu title="Utility">
        <menu-option
          title="Zoom in"
          :icon="ZoomInIcon"
          :shortcuts="['CTRL', 'SHIFT', '+']"
        />
        <menu-option
          title="Zoom out"
          :icon="ZoomOutIcon"
          :shortcuts="['CTRL', '-']"
        />
        <menu-option
          title="Reset zoom"
          :icon="ZoomToExtentsIcon"
          :shortcuts="['CTRL', '0']"
        />

        <menu-splitter />
        <menu-option
          :shortcuts="['CTRL', 'SHIFT', 'X']"
          title="Clear queue"
          :icon="BroomIcon"
          @click="player.queue.clear()"
        />
        <menu-option
          :shortcuts="['CTRL', 'SHIFT', 'Z']"
          title="Clear errored"
          :icon="BroomIcon"
          @click="player.queue.clearErrored()"
        />

        <menu-splitter />
        <menu-option
          :title="`Check for updates`"
          :icon="RestartIcon"
          @click="electron.checkForUpdates()"
        />
      </Menu>
      <Menu title="About">
        <menu-option
          title="GitHub Repository"
          :icon="GitHubIcon"
          @click="electron.open('https://github.com/geoxor/amethyst')"
        />
        <menu-option
          title="Discord Server"
          :icon="DiscordIcon"
          @click="electron.open('https://discord.gg/geoxor')"
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
          @click="electron.testNotification('showUpdateInstallingNotification')"
        />
        <menu-option
          title="Test 'UpdateAvailableNotification'"
          @click="electron.testNotification('showUpdateAvailableNotification')"
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
      <div 
        :class="[
          fps < 30 && 'text-red-500',
          fps >= 30 && fps < 155 && 'text-yellow-300',
          fps >= (155*0.8) && 'text-green-500',
        ]"
        class="font-aseprite"
      >
        {{ fps }}fps
      </div>
      <processor-usage-meter
        :value="state.state.cpuUsage.renderer"
      />
      <processor-usage-meter
        :value="state.state.cpuUsage.node"
      />
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
