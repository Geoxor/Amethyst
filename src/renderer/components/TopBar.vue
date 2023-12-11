<script lang="ts" setup>
import { amethyst, useState } from "@/amethyst";
import ControlButtons from "@/components/input/ControlButtons.vue";
import UpdateButton from "@/components/input/UpdateButton.vue";
import Menu from "@/components/menu/MenuContainer.vue";
import MenuOption from "@/components/menu/MenuOption.vue";
import MenuSplitter from "@/components/menu/MenuSplitter.vue";
import ProcessorUsageMeter from "@/components/ProcessorUsageMeter.vue";
import { AmethystIcon } from "@/icons";
import { useFps } from "@vueuse/core";
import { computed, onMounted, ref } from "vue";
import { countDomElements, refreshWindow, smoothTween } from "@/logic/dom";
import BaseChip from "./BaseChip.vue";
import TitleText from "./v2/TitleText.vue";

const min = ref(Number.POSITIVE_INFINITY);
const max = ref(Number.NEGATIVE_INFINITY);
const fpsCounter = useFps({every: 60});
const fps = ref(0);
const tweenedFps = ref(0);
const domSize = ref(0);
const latency = ref(0);
const cpuUsage = ref({
  node: 0,
  renderer: 0
});

type ProcessorUsage = {node: number, renderer: number};

onMounted(() => {
  setInterval(() => {
    fps.value = fpsCounter.value;
    if (fps.value > max.value) max.value = fps.value;
    if (fps.value < min.value) min.value = fps.value;
    domSize.value = countDomElements();
    amethyst.player.getLatency().then(l => latency.value = l);
    // TODO: multiplatform support
    if (amethyst.getCurrentPlatform() === "desktop") {
      window.electron.ipcRenderer.invoke<ProcessorUsage>("percent-cpu-usage").then(usage => cpuUsage.value = usage);
    }
    smoothTween(tweenedFps.value, fpsCounter.value, 1000, (tweenedNumber => tweenedFps.value = ~~tweenedNumber));

  }, 1000);
});

const state = useState();

const commandOrControlSymbol = computed(() => amethyst.getCurrentOperatingSystem() === "mac" ? "⌘" : "CTRL");

</script>

<template>
  <div
    class=" z-100 font-main drag h-40px pr-2 text-12px select-none flex justify-between items-center"
    :class="[state.state.isFocused ? 'text-text_title' : 'text-text_subtitle']"
  >
    <div
      class="flex no-drag h-full items-center"
    
      :class="[amethyst.getCurrentOperatingSystem() == 'mac' && 'pl-16']"
    >
      <div
        class="logo w-52px h-full items-center flex justify-center cursor-heart-pointer rounded-br-8px hover:bg-primary hover:bg-opacity-10 hover:text-primary"
        :style="`transition-duration: ${state.settings.value.animationDuration}ms`"
      >
        <AmethystIcon class="w-5 h-5" />
      </div>
      <Menu title="File">
        <menu-option
          :shortcuts="[commandOrControlSymbol, 'O']"
          title="Open audio..."
          :icon="AmethystIcon"
          @click="amethyst.openAudioFilesAndAddToQueue"
        />
        <menu-option
          :shortcuts="[commandOrControlSymbol, 'SHIFT', 'O']"
          title="Open audio folder..."
          :icon="AmethystIcon"
          @click="amethyst.openAudioFoldersAndAddToQueue"
        />
      </Menu>
      <Menu title="Utility">
        <menu-option
          :shortcuts="[commandOrControlSymbol, 'SHIFT', 'X']"
          title="Clear queue"
          :icon="AmethystIcon"
          @click="amethyst.player.queue.clear()"
        />
        <menu-option
          :shortcuts="[commandOrControlSymbol, 'SHIFT', 'Z']"
          title="Clear errored / deleted"
          :icon="AmethystIcon"
          @click="amethyst.player.queue.clearErrored()"
        />
        <menu-splitter />
        <menu-option
          :shortcuts="[commandOrControlSymbol, 'ALT', 'R']"
          title="Refresh all metadata"
          :icon="AmethystIcon"
          @click="amethyst.player.queue.fetchAsyncData(true)"
        />
        <menu-option
          :shortcuts="[commandOrControlSymbol, 'R']"
          title="Refresh window"
          :icon="AmethystIcon"
          @click="refreshWindow"
        />

        <menu-splitter 
          v-if="amethyst.getCurrentPlatform() === 'desktop'"
        />
        <menu-option
          v-if="amethyst.getCurrentPlatform() === 'desktop'"
          :title="`Check for updates`"
          :icon="AmethystIcon"
          @click="amethyst.checkForUpdates()"
        />
      </Menu>
      <Menu title="View">
        <menu-option
          v-if="amethyst.getCurrentPlatform() === 'desktop'"
          title="Zoom in"
          :icon="AmethystIcon"
          :shortcuts="[commandOrControlSymbol, '+']"
          @click="amethyst.zoom('in')"
        />
        <menu-option
          v-if="amethyst.getCurrentPlatform() === 'desktop'"
          title="Zoom out"
          :icon="AmethystIcon"
          :shortcuts="[commandOrControlSymbol, '-']"
          @click="amethyst.zoom('out')"
        />
        <menu-option
          v-if="amethyst.getCurrentPlatform() === 'desktop'"
          title="Reset zoom"
          :icon="AmethystIcon"
          :shortcuts="[commandOrControlSymbol, '0']"
          @click="amethyst.zoom('reset')"
        />
        <menu-splitter 
          v-if="amethyst.getCurrentPlatform() === 'desktop'"
        />
        <menu-option
          title="Settings"
          :icon="AmethystIcon"
          @click="$router.push({ name: 'settings.appearance' })"
        />
        <menu-option
          title="Show developer tools"
          :icon="AmethystIcon"
          @click="amethyst.openDevTools()"
        />
      </Menu>
      <Menu title="About">
        <menu-option
          title="Documentation..."
          :icon="AmethystIcon"
          @click="amethyst.openLink('https://amethyst.pages.dev/')"
        />
        <menu-option
          title="GitHub Repository..."
          :icon="AmethystIcon"
          @click="amethyst.openLink('https://github.com/geoxor/amethyst')"
        />
        <menu-option
          title="Discord Server..."
          :icon="AmethystIcon"
          @click="amethyst.openLink('https://discord.gg/geoxor')"
        />
      </Menu>
      <Menu
        v-if="amethyst.IS_DEV"
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
      </Menu>
    </div>

    <p class="absolute flex items-center gap-1 left-1/2 transform-gpu -translate-x-1/2 select-none ">
      <title-text text="Amethyst" />
      <title-text
        class="opacity-50 font-normal capitalize"
        :text="amethyst.getCurrentPlatform()"
      />
      <BaseChip
        v-if="amethyst.IS_DEV"
        :color="state.state.isFocused ? undefined : 'bg-gray-500'"
      >
        dev
      </BaseChip>
      <title-text
        class="opacity-50 font-normal capitalize"
        :text="amethyst.VERSION"
      />
    </p>

    <div class="flex gap-1.25 h-6 items-center overflow-hidden font-aseprite whitespace-nowrap">
      <div
        v-if="state.settings.value.showDebugStats"
        class="w-56 flex gap-1 justify-end no-drag" 
        @click="min = Number.POSITIVE_INFINITY; max = Number.NEGATIVE_INFINITY;"
      >
        <div class="hidden lg:inline font-aseprite text-primary-900 text-opacity-50">
          {{ domSize }}<strong class="text-primary-900 text-opacity-25">DOM </strong>
          {{ amethyst.player.getBufferSize() }}<strong class="text-primary-900 text-opacity-25">smp</strong>
          {{ latency.toFixed(2) }}<strong class="text-primary-900 text-opacity-25">ms</strong>
        </div>
        <div 
          :class="[
            fps < 30 && 'text-rose-500',
            fps >= 30 && fps < max && 'text-yellow-300',
            fps >= (max*0.8) && 'text-green-500',
          ]"
          class="font-aseprite"
        >
          {{ tweenedFps }}fps
        </div>
        <div
          class="hidden lg:inline font-aseprite text-primary-900 text-opacity-50"
        >
          {{ min }}<strong class="text-primary-900 text-opacity-25">min</strong> {{ max }}<strong class="text-primary-900 text-opacity-25">max</strong>
        </div>
      </div>
    
      <update-button
        v-if="state.state.updateReady"
        @click="amethyst.performWindowAction('close')"
      />
        
      <template v-if="state.settings.value.showDebugStats">
        <processor-usage-meter
          v-for="value of Object.values(cpuUsage)"
          :key="value"
          :value="value"
        />
      </template>
      <control-buttons
        v-if="amethyst.getCurrentPlatform() === 'desktop' && amethyst.getCurrentOperatingSystem() != 'mac'"
        :is-maximized="state.state.isMaximized"
        @close="amethyst.performWindowAction('close')"
        @minimize="amethyst.performWindowAction('minimize')"
        @maximize="amethyst.performWindowAction('maximize')"
        @unmaximize="amethyst.performWindowAction('unmaximize')"
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
