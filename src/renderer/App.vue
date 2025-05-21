<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { Vibrant } from "node-vibrant/browser";
import { onMounted, onUnmounted, ref, watch } from "vue";

import { amethyst } from "@/amethyst.js";
import BackgroundImage from "@/components/BackgroundImage.vue";
import { ContextMenu, useContextMenu } from "@/components/ContextMenu";
import CoverArt from "@/components/CoverArt.vue";
import { InspectorBar, useInspector } from "@/components/Inspector";
import NavigationBar from "@/components/NavigationBar.vue";
import NavigationButton from "@/components/NavigationButton.vue";
import TopBar from "@/components/TopBar.vue";
import PlaybackControls from "@/components/v2/PlaybackControls.vue";
import SpectrumAnalyzerComposite from "@/components/visualizers/SpectrumAnalyzerComposite.vue";
import { getThemeColor, hexToRgb } from "@/logic/color";
import type { Track } from "@/logic/track";

const ambientBackgroundImage = ref("");

const setAmbientCover = async (track: Track) => {
  track.getCoverAsBlob()
    .then(blob => ambientBackgroundImage.value = URL.createObjectURL(blob))
    .catch(() => ambientBackgroundImage.value = "");
};

const fallbackToDefault = () => {
  document.documentElement.style.removeProperty("--accent");
  document.documentElement.style.removeProperty("--primary");
  amethyst.state.emit("theme:change", "");
};

const setCustomColors = () => {
  const accentColor = amethyst.state.settings.appearance.customColors.colors.accent;
  const primaryColor = amethyst.state.settings.appearance.customColors.colors.primary;
  const inspectorColor = amethyst.state.settings.appearance.customColors.colors.inspector;
  const alertColor = amethyst.state.settings.appearance.customColors.colors.alert;

  const accentColorRgb = hexToRgb(accentColor);
  const primaryColorRgb = hexToRgb(primaryColor);
  const inspectorColorRgb = hexToRgb(inspectorColor);
  const alertColorRgb = hexToRgb(alertColor);

  document.documentElement.style.setProperty("--accent", `${accentColorRgb.r}, ${accentColorRgb.g}, ${accentColorRgb.b}`);
  document.documentElement.style.setProperty("--primary", `${primaryColorRgb.r}, ${primaryColorRgb.g}, ${primaryColorRgb.b}`);
  document.documentElement.style.setProperty("--inspector-color", `${inspectorColorRgb.r}, ${inspectorColorRgb.g}, ${inspectorColorRgb.b}`);
  document.documentElement.style.setProperty("--alert-color", `${alertColorRgb.r}, ${alertColorRgb.g}, ${alertColorRgb.b}`);

  amethyst.state.emit("theme:change", "");
};

const setDynamicColors = async (track: Track) => {
  if (!amethyst.state.settings.appearance.coverBasedColors) return;
  const coverBase64 = track.getCover();
  if (!coverBase64) return fallbackToDefault();

  const palette = await Vibrant.from(coverBase64).getPalette();
  if (!palette.Vibrant && !palette.LightVibrant) return;
  
  const newAccentColor = `${palette.Vibrant?.r}, ${palette.Vibrant?.g}, ${palette.Vibrant?.b}`;
  const newPrimaryColor = `${palette.LightVibrant?.r}, ${palette.LightVibrant?.g}, ${palette.LightVibrant?.b}`;

  document.documentElement.style.setProperty("--accent", newAccentColor);
  document.documentElement.style.setProperty("--primary", newPrimaryColor);

  setDynamicIconColors();

  amethyst.state.emit("theme:change", "");
};

function setDynamicIconColors() {
  if (!amethyst.state.settings.appearance.coverBasedIconColors) {
    window.electron.ipcRenderer.invoke("set-default-icon", []);
    return;
  }

  const color = getThemeColor("--accent");
  window.electron.ipcRenderer.invoke("set-icon-tint", [color.r, color.g, color.b]);
}

watch(() => amethyst.state.settings.appearance.coverBasedColors, enabled => {
  if (enabled) {
    const currentTrack = amethyst.player.getCurrentTrack();
    if (!currentTrack) return;
    setDynamicColors(currentTrack);
  } else {
    fallbackToDefault();
  }
});

watch(() => amethyst.state.settings.appearance.customColors.enabled, enabled => {
  if (enabled) {
    setCustomColors();
  } else {
    fallbackToDefault();
  }
});

watch(() => [
  amethyst.state.settings.appearance.customColors.colors.accent, 
  amethyst.state.settings.appearance.customColors.colors.primary,
  amethyst.state.settings.appearance.customColors.colors.inspector, 
  amethyst.state.settings.appearance.customColors.colors.alert
], () => {
  setCustomColors();
});

watch(() => amethyst.state.settings.appearance.coverBasedIconColors, setDynamicIconColors);

onMounted(() => {
  amethyst.player.on("player:trackChange", track => {
    setAmbientCover(track);
    setDynamicColors(track);
    setDynamicIconColors();
  });
  if (amethyst.state.settings.appearance.customColors.enabled) {
    setCustomColors();
  }
});

onUnmounted(() => {
  amethyst.player.off("player:trackChange", setAmbientCover);
});

watch(() => amethyst.state.showBigSpectrum.value, () => {
  amethyst.performWindowAction("fullscreen");
});

</script>

<template>
  <div v-if="amethyst.state.showBigSpectrum.value" class="absolute top-0 left-0 w-320px h-280px z-30 bg-surface-800 "
    @click="amethyst.state.showBigSpectrum.value = false">
    <spectrum-analyzer-composite key="big-spectrum-analyzer" :node="amethyst.player.nodeManager.master.pre"
      :type="amethyst.state.settings.metering.spectrum.type" />
  </div>
  <div v-else class="flex fixed flex-col bg-surface-900">
    <context-menu v-if="useContextMenu().state.isVisible" />

    <background-image v-if="amethyst.state.settings.appearance.ambientBackground.show"
      :ambient-background-image="ambientBackgroundImage" />

    <div v-if="amethyst.state.window.isShowingBigCover"
      class=" select-none rounded-8px w-full sm:w-auto max-w-3/4 max-h-3/4 truncate absolute-xy z-50"
      style="aspect-ratio: 1/1;">
      <cover-art :url="ambientBackgroundImage" class="w-full drop-shadow-2xl z-30" @contextmenu="useContextMenu().open({x: $event.x, y: $event.y}, [
          { title: 'Export cover...', icon: 'ic:twotone-add-photo-alternate', action: () => amethyst.player.getCurrentTrack()?.exportCover() },
        ]);" @click="amethyst.state.window.isShowingBigCover = !amethyst.state.window.isShowingBigCover" />

      <icon icon="ic:twotone-close" class="utilityButton absolute top-3 right-3 cursor-pointer"
        @click="amethyst.state.window.isShowingBigCover = false" />
    </div>

    <div v-if="amethyst.getCurrentPlatform() == 'web'"
      class="h-6 bg-yellow-500  items-center flex gap-1 justify-center select-none w-full text-12px">
      Amethyst Web is heavily disfunctional due to
      Chrome's security policies regarding filesystem access, for the best experience <a
        href="https://github.com/Geoxor/amethyst/releases/latest" target="_blank"> <strong
          class="duration-user-defined underline cursor-pointer hover:text-accent">download the native app</strong> </a>
    </div>

    <top-bar v-if="amethyst.getCurrentPlatform() == 'desktop'" />
    
    <div v-if="amethyst.getCurrentPlatform() == 'mobile' && !amethyst.state.settings.appearance.desktopMode" class="w-full absolute bottom-0 ">
      <div v-if="amethyst.getCurrentPlatform() == 'mobile'"
        class="px-2 absolute z-30 left-0 bottom-3 w-full">
        <div class="p-2 rounded-32px flex bg-surface-700 justify-between items-center h-50px">
          <navigation-button icon="ic:twotone-queue-music" route-name="queue" mobile />

          <navigation-button icon="ic:twotone-library-music" mobile route-name="discovery" />

          <navigation-button icon="ic:twotone-favorite" mobile route-name="favorites" />

          <navigation-button icon="ic:round-music-note" route-name="now-playing" class="transform-gpu box-content border-solid border-4px border-surface-900 bg-surface-700 max-w-9 mx-3 rounded-full z-1 scale-175" mobile />

          <navigation-button icon="mdi:resistor-nodes" route-name="node-editor" mobile />

          <navigation-button icon="ic:twotone-mic-external-on" route-name="audio-monitor" mobile />

          <navigation-button icon="ic:twotone-settings" route-name="settings" mobile />
        </div>
      </div>

    </div>
    <div class="h-full whitespace-nowrap flex flex-col justify-between">
      <div class="flex-1 flex h-full max-h-full relative">
        <navigation-bar v-if="amethyst.getCurrentPlatform() !== 'mobile' || amethyst.state.settings.appearance.desktopMode" />

        <div class="flex flex-col w-full overflow-hidden">
          <router-view class="truncate disable-select no-drag" />
        </div>
        <inspector-bar v-if="useInspector().state.isVisible" />
      </div>

      <playback-controls v-if="amethyst.state.settings.appearance.showPlaybackControls && amethyst.getCurrentPlatform() !== 'mobile' || amethyst.state.settings.appearance.desktopMode"
        :class="[amethyst.getCurrentPlatform() == 'mobile'  && !amethyst.state.settings.appearance.desktopMode && 'mb-12']" />
    </div>
  </div>
</template> 

<style lang="postcss">
@import url(themes/amethyst-dark.css);
@import url(themes/emerald-dark.css);
@import url(themes/onyx-dark.css);
@import url(themes/rose-dark.css);
@import url(themes/ruby-dark.css);
@import url(themes/sapphire-dark.css);

/* these are necessary styles for vue flow */
@import '@vue-flow/core/dist/style.css';

/* this contains the default theme, these are optional styles */
@import '@vue-flow/core/dist/theme-default.css';

@import url(base.css);
</style>