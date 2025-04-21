<script lang="ts" setup>
import { amethyst, useState } from "@/amethyst";
import ControlButtons from "@/components/input/ControlButtons.vue";
import UpdateButton from "@/components/input/UpdateButton.vue";
import MenuContainer from "@/components/menu/MenuContainer.vue";
import MenuOption from "@/components/menu/MenuOption.vue";
import MenuSplitter from "@/components/menu/MenuSplitter.vue";
import AmethystIcon from "@/icons/AmethystIcon.vue";
import { countDomElements, refreshWindow, smoothTween } from "@/logic/dom";
import { useFps } from "@vueuse/core";
import { computed, onMounted, provide, ref } from "vue";
import { useRouter } from "vue-router";
import BaseChip from "./BaseChip.vue";
import TitleText from "./v2/TitleText.vue";

const min = ref(Number.POSITIVE_INFINITY);
const max = ref(Number.NEGATIVE_INFINITY);
const fpsCounter = useFps({every: 60});
const fps = ref(0);
const tweenedFps = ref(0);
const domSize = ref(0);
const latency = ref(0);
const router = useRouter();

onMounted(() => {
  setInterval(() => {
    fps.value = fpsCounter.value;
    if (fps.value > max.value) max.value = fps.value;
    if (fps.value < min.value) min.value = fps.value;
    domSize.value = countDomElements();
    amethyst.player.getLatency().then(l => latency.value = l);
    // TODO: multiplatform support
    smoothTween(tweenedFps.value, fpsCounter.value, 1000, (tweenedNumber => tweenedFps.value = ~~tweenedNumber));

  }, 1000);
});

const state = useState();

const commandOrControlSymbol = computed(() => amethyst.getCurrentOperatingSystem() === "mac" ? "⌘" : "CTRL");

const menuGroupRef = ref<{
  activeMenu: string | null;
}>({
  activeMenu: null
});

provide("menuGroupRef", menuGroupRef);
</script>

<template>
  <div
    class=" z-100 font-main drag h-40px pr-2 text-12px select-none flex justify-between items-center transition-colors duration-user-defined"
    :class="[state.state.isFocused ? 'text-text_title' : 'text-text_subtitle']"
  >
    <div
      class="flex no-drag h-full items-center"
    
      :class="[amethyst.getCurrentOperatingSystem() == 'mac' && 'pl-16']"
    >
      <div
        class="duration-user-defined logo w-52px h-full items-center flex justify-center cursor-heart-pointer rounded-br-8px hover:bg-primary hover:bg-opacity-10 hover:text-primary"
      >
        <amethyst-icon class="w-5 h-5" />
      </div>
      <menu-container :title="$t('menu.file')">
        <menu-option
          :shortcuts="[commandOrControlSymbol, 'O']"
          :title="$t('menu.file.open_audio')"
          icon="ic:twotone-audio-file"
          @click="amethyst.openAudioFilesAndAddToQueue"
        />
        <menu-option
          :shortcuts="[commandOrControlSymbol, 'SHIFT', 'O']"
          :title="$t('menu.file.open_audio_folder')"
          icon="ic:twotone-folder"
          @click="amethyst.openAudioFoldersAndAddToQueue"
        />
      </menu-container>
      <menu-container :title="$t('menu.utility')">
        <menu-option
          :shortcuts="[commandOrControlSymbol, 'SHIFT', 'X']"
          :title="$t('menu.utility.clear_queue')"
          icon="ic:twotone-delete-sweep"
          @click="amethyst.player.queue.clear()"
        />
        <menu-option
          :shortcuts="[commandOrControlSymbol, 'SHIFT', 'Z']"
          :title="$t('menu.utility.clear_errored_and_deleted')"
          icon="ic:twotone-delete-sweep"
          @click="amethyst.player.queue.clearErrored()"
        />
        <menu-splitter />
        <menu-option
          :shortcuts="[commandOrControlSymbol, 'ALT', 'R']"
          :title="$t('menu.utility.refresh_all_metadata')"
          icon="ic:twotone-refresh"
          @click="amethyst.player.queue.fetchAsyncData(true)"
        />
        <menu-option
          :shortcuts="[commandOrControlSymbol, 'R']"
          :title="$t('menu.utility.refresh_window')"
          icon="ic:twotone-refresh"
          @click="refreshWindow"
        />

        <menu-splitter 
          v-if="amethyst.getCurrentPlatform() === 'desktop'"
        />
        <menu-option
          v-if="amethyst.getCurrentPlatform() === 'desktop'"
          :title="$t('menu.utility.check_for_updates')"
          icon="ic:twotone-update"
          @click="amethyst.checkForUpdates()"
        />
      </menu-container>
      <menu-container :title="$t('menu.view')">
        <menu-option
          v-if="amethyst.getCurrentPlatform() === 'desktop'"
          :title="$t('menu.view.zoom_in')"
          icon="ic:twotone-zoom-in"
          :shortcuts="[commandOrControlSymbol, '+']"
          @click="amethyst.zoom('in')"
        />
        <menu-option
          v-if="amethyst.getCurrentPlatform() === 'desktop'"
          :title="$t('menu.view.zoom_out')"
          icon="ic:twotone-zoom-out"
          :shortcuts="[commandOrControlSymbol, '-']"
          @click="amethyst.zoom('out')"
        />
        <menu-option
          v-if="amethyst.getCurrentPlatform() === 'desktop'"
          :title="$t('menu.view.reset_zoom')"
          icon="ic:twotone-zoom-in-map"
          :shortcuts="[commandOrControlSymbol, '0']"
          @click="amethyst.zoom('reset')"
        />
        <menu-splitter 
          v-if="amethyst.getCurrentPlatform() === 'desktop'"
        />
        <menu-option
          :title="$t('menu.view.settings')"
          icon="ic:twotone-settings"
          :shortcuts="[commandOrControlSymbol, ',']"
          @click="router.push({ name: 'settings.appearance' })"
        />
        <menu-option
          :title="$t('menu.view.show_developer_tools')"
          icon="ic:twotone-bug-report"
          @click="amethyst.openDevTools()"
        />
      </menu-container>
      <menu-container :title="$t('menu.about')">
        <menu-option
          :title="$t('menu.about.documentation')"
          icon="ic:twotone-menu-book"
          @click="amethyst.openLink('https://amethyst.pages.dev/')"
        />
        <menu-option
          :title="$t('menu.about.github_repository')"
          @click="amethyst.openLink('https://github.com/geoxor/amethyst')"
        />
        <menu-option
          :title="$t('menu.about.discord_server')"
          @click="amethyst.openLink('https://discord.gg/geoxor')"
        />
      </menu-container>
      <menu-container
        v-if="amethyst.IS_DEV"
        title="Debug Tools"
      >
        <menu-option
          title="Set 'updateReady' to 'true'"
          @click="state.state.updateReady = true;"
        />
        <menu-option
          title="Set 'updateReady' to 'false'"
          @click="state.state.updateReady = false;"
        />
      </menu-container>
    </div>

    <p class="absolute flex items-center gap-1 top-10px left-1/2 transform-gpu -translate-x-1/2 select-none">
      <title-text text="Amethyst" />
      <title-text
        class="opacity-50 font-normal capitalize"
        :text="amethyst.getCurrentPlatform()"
      />
      <base-chip
        v-if="amethyst.IS_DEV"
        :color="state.state.isFocused ? undefined : 'bg-gray-500'"
      >
        development
      </base-chip>
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
