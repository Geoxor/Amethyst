<script lang="ts" setup>
import { useElectron, useState } from "@/amethyst";
import ControlButtons from "@/components/input/ControlButtons.vue";
import UpdateButton from "@/components/input/UpdateButton.vue";
import Menu from "@/components/menu/MenuContainer.vue";
import MenuOption from "@/components/menu/MenuOption.vue";
import MenuSplitter from "@/components/menu/MenuSplitter.vue";
import ProcessorUsageMeter from "@/components/ProcessorUsageMeter.vue";
import { AudioFileIcon, DiscordIcon, GitHubIcon, MusicFolderIcon, ResetIcon, ZoomInIcon, ZoomOutIcon, RemoveIcon, ResizeIcon, DownloadingUpdatesIcon, SettingsIcon, BookshelfIcon } from "@/icons/material";
import { useFps } from "@vueuse/core";
import { player } from "@/logic/player";
import AmethystLogo from "@/icons/AmethystLogo.vue";
import { onMounted, ref } from "vue";
const min = ref(Number.POSITIVE_INFINITY);
const max = ref(Number.NEGATIVE_INFINITY);
const fpsCounter = useFps({every: 60});
const fps = ref(0);

onMounted(() => {
  setInterval(() => {
    fps.value = fpsCounter.value;
    if (fps.value > max.value) max.value = fps.value;
    if (fps.value < min.value) min.value = fps.value;
  }, 1000);
});

const state = useState();
const electron = useElectron();
const refreshWindow = () => location.reload();
</script>

<template>
  <div
    class="borderBottom z-100 font-main drag text-12px select-none flex justify-between items-center"
    :class="[state.state.isFocused ? 'text-primary-1000' : 'text-primary-900']"
  >
    <div class="flex no-drag h-full items-center">
      <div class="logo w-40px items-center flex justify-center cursor-heart-pointer">
        <amethyst-logo
          class="w-4 h-4 min-h-4 min-w-4"
        />
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
          :icon="ResizeIcon"
          :shortcuts="['CTRL', '0']"
        />

        <menu-splitter />
        <menu-option
          :shortcuts="['CTRL', 'SHIFT', 'X']"
          title="Clear queue"
          :icon="RemoveIcon"
          @click="player.queue.clear()"
        />
        <menu-option
          :shortcuts="['CTRL', 'SHIFT', 'Z']"
          title="Clear errored"
          :icon="RemoveIcon"
          @click="player.queue.clearErrored()"
        />
        <menu-splitter />
        <menu-option
          :shortcuts="['CTRL', 'ALT', 'R']"
          title="Refresh all metadata"
          :icon="ResetIcon"
          @click="player.queue.fetchAsyncData(true)"
        />
        <menu-option
          :shortcuts="['CTRL', 'R']"
          title="Refresh window"
          :icon="ResetIcon"
          @click="refreshWindow"
        />

        <menu-splitter />
        <menu-option
          :title="`Check for updates`"
          :icon="DownloadingUpdatesIcon"
          @click="electron.checkForUpdates()"
        />
      </Menu>
      <Menu title="View">
        <menu-option
          title="Settings"
          :icon="SettingsIcon"
          @click="state.settings.showSettings = !state.settings.showSettings"
        />
        <menu-option
          title="Show dev tools"
          :icon="SettingsIcon"
          :shortcuts="['CTRL', 'SHIFT', 'I']"
          @click="electron.showDevTools()"
        />
      </Menu>

      <Menu title="About">
        <menu-option
          title="Documentation"
          :icon="BookshelfIcon"
          @click="electron.open('https://amethyst.pages.dev/')"
        />
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

    <p class="absolute left-1/2 transform-gpu -translate-x-1/2">
      Amethyst v{{ state.state.version }}
    </p>

    <div class="flex gap-1.25 items-center overflow-hidden font-aseprite">
      <div class="w-40 flex gap-1 justify-end">
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
        <div
          class="hidden lg:inline no-drag font-aseprite text-primary-900 text-opacity-50"
          @click="min = Number.POSITIVE_INFINITY; max = Number.NEGATIVE_INFINITY;"
        >
          <strong class="text-primary-900 text-opacity-25">min</strong> {{ min }} <strong class="text-primary-900 text-opacity-25">max</strong> {{ max }}
        </div>
      </div>
      <update-button
        v-if="state.state.updateReady"
        @click="electron.close()"
      />
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
