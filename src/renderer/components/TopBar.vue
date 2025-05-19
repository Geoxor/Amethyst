<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { useFps } from "@vueuse/core";
import { computed, onMounted, provide, ref } from "vue";
import { useRouter } from "vue-router";

import { amethyst } from "@/amethyst.js";
import BaseChip from "@/components/BaseChip.vue";
import ControlButtons from "@/components/input/ControlButtons.vue";
import UpdateButton from "@/components/input/UpdateButton.vue";
import MenuContainer from "@/components/menu/MenuContainer.vue";
import MenuOption from "@/components/menu/MenuOption.vue";
import MenuSplitter from "@/components/menu/MenuSplitter.vue";
import LoadingIcon from "@/components/v2/LoadingIcon.vue";
import TitleText from "@/components/v2/TitleText.vue";
import AmethystIcon from "@/icons/AmethystIcon.vue";
import { countDomElements, refreshWindow, smoothTween } from "@/logic/dom";
import { randomIntInRange } from "@/logic/math";

const min = ref(Number.POSITIVE_INFINITY);
const max = ref(Number.NEGATIVE_INFINITY);
const fpsCounter = useFps({every: 60});
const fps = ref(0);
const tweenedFps = ref(0);
const domSize = ref(0);
const latency = ref(0);
const router = useRouter();

const branchName = ref("Development");
const commitHash = ref('unknown commit hash');

onMounted(() => {
  if (amethyst.IS_DEV) {
    window.electron.ipcRenderer.invoke<{branchName: string, commitHash: string}>('get-branch-name').then(info => {
      branchName.value = info.branchName;
      commitHash.value = info.commitHash.substring(0, 7);
    })
  }

  setInterval(() => {
    fps.value = fpsCounter.value;
    if (fps.value > max.value) max.value = fps.value;
    if (fps.value < min.value) min.value = fps.value;
    domSize.value = countDomElements();
    amethyst.player.getLatency().then(l => latency.value = l);
    // TODO: multiplatform support
    smoothTween(tweenedFps.value, fpsCounter.value, 1000, (tweenedNumber => tweenedFps.value = Math.ceil(tweenedNumber)));

  }, 1000);
});

const commandOrControlSymbol = computed(() => amethyst.getCurrentOperatingSystem() === "mac" ? "⌘" : "CTRL");

const menuGroupRef = ref<{
  activeMenu: string | null;
}>({
  activeMenu: null
});

const showHeart = ref(false);

const playEasterEggSound = () => {
  showHeart.value == false && setTimeout(() => {
    showHeart.value = false;
  }, 500);
  showHeart.value = true;
  const audioElement = document.createElement("audio");
  // @ts-ignore
  audioElement.src = new URL(`/sounds/amethyst${randomIntInRange(1, 4)}.flac`, import.meta.url).toString();;
  audioElement.volume = 0.33;
  audioElement.play();
  audioElement.remove();
}
provide("menuGroupRef", menuGroupRef);
</script>

<template>
  <div
    class=" z-100 font-main drag pr-2 text-12px flex justify-between select-none items-center transition-colors duration-user-defined"
    :class="[amethyst.state.window.isFocused ? 'text-text-title' : 'text-text-subtitle', amethyst.getCurrentOperatingSystem() == 'mac' ? 'min-h-24px' : 'min-h-40px']"
  >
    <div
        v-if="amethyst.getCurrentOperatingSystem() !== 'mac'"
        class="flex no-drag h-full items-center"
    >
      <div
        class="duration-user-defined logo w-52px h-full items-center active:scale-90 flex justify-center cursor-heart-pointer rounded-br-8px hover:bg-primary/10 hover:text-primary"
        @click="playEasterEggSound()"
      >
        <amethyst-icon v-if="!showHeart" class="w-5 h-5" />
        <icon v-else class="w-5 h-5 text-pink-700" icon="ic:twotone-favorite"/>
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
          :title="$t('menu.about.guides')"
          icon="ic:twotone-book"
          @click="amethyst.openLink('https://amethyst.geoxor.moe/guides')"
        />
        <menu-option
          :title="$t('menu.about.user_manual')"
          icon="ic:twotone-menu-book"
          @click="amethyst.openLink('https://amethyst.geoxor.moe/user-manual')"
        />
        <menu-option
          :title="$t('menu.about.github_repository')"
          icon="mdi:github"
          @click="amethyst.openLink('https://github.com/geoxor/amethyst')"
        />
        <menu-option
          :title="$t('menu.about.discord_server')"
          icon="ic:baseline-discord"
          @click="amethyst.openLink('https://discord.gg/geoxor')"
        />
      </menu-container>
      <menu-container
        v-if="amethyst.IS_DEV"
        title="Debug Tools"
      >
        <menu-option
          title="Set 'updateReady' to 'true'"
          @click="amethyst.state.window.updateReady = true;"
        />
        <menu-option
          title="Set 'updateReady' to 'false'"
          @click="amethyst.state.window.updateReady = false;"
        />
      </menu-container>
    </div>

    <p class="absolute-x flex items-center gap-1 top-10px">
      <loading-icon v-if="amethyst.isLoading.value" />
      <title-text text="Amethyst" />
      <title-text
        class="opacity-50 font-normal capitalize"
        :text="amethyst.getCurrentPlatform()"
      />
      <base-chip
        v-if="amethyst.IS_DEV"
        :color="amethyst.state.window.isFocused ? undefined : 'primary-900'"
        class="hover:underline no-drag cursor-pointer"
        @click="amethyst.openLink(`https://github.com/Geoxor/Amethyst/tree/${branchName}`)"
      >
        {{ branchName }} ⚐ {{commitHash}}
      </base-chip>
      <title-text
        class="opacity-50 font-normal"
        :text="amethyst.VERSION"
      />
    </p>

    <div class="flex gap-1.25 h-6 items-center truncate font-aseprite whitespace-nowrap">
      <div
        v-if="amethyst.state.settings.appearance.showDebugStats"
        class="w-min flex gap-1 justify-end no-drag" 
        @click="min = Number.POSITIVE_INFINITY; max = Number.NEGATIVE_INFINITY;"
      >
        <div class="hidden lg:inline font-aseprite text-primary-900/50">
          {{ domSize }}<span class="text-primary-900/25">DOM </span>
          {{ amethyst.player.getBufferSize() }}<span class="text-primary-900/25">smp</span>
          {{ latency.toFixed(2) }}<span class="text-primary-900/25">ms</span>
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
      </div>
    
      <update-button
        v-if="amethyst.state.window.updateReady"
        @click="amethyst.performWindowAction('close')"
      />
        
      <control-buttons
        v-if="amethyst.getCurrentPlatform() === 'desktop' && amethyst.getCurrentOperatingSystem() != 'mac'"
        :is-maximized="amethyst.state.window.isMaximized"
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
