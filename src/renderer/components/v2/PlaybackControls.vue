<script setup lang="ts">
import { amethyst } from "@/amethyst";
import { useContextMenu } from "@/components/ContextMenu";
import CoverArt from "@/components/CoverArt.vue";
import Slider from "@/components/input/BaseSlider.vue";
import { useInspector } from "@/components/Inspector";
import PlaybackButtons from "@/components/PlaybackButtons.vue";
import ResizableDiv from "@/components/ResizableDiv";
import OutputDiagram from "@/components/v2/OutputDiagram.vue";
import DbMeter from "@/components/visualizers/DbMeter.vue";
import LoudnessMeter from "@/components/visualizers/LoudnessMeter.vue";
import Oscilloscope from "@/components/visualizers/OscilloscopeAnalyzer.vue";
import SpectrumAnalyzer from "@/components/visualizers/SpectrumAnalyzer.vue";
import Vectorscope from "@/components/visualizers/VectorscopeAnalyzer.vue";
import { getThemeColor } from "@/logic/color";
import { router } from "@/router";
import { Icon } from "@iconify/vue";
import { secondsToColinHuman } from "@shared/formating";
import { LoadStatus } from "@shared/types";
import DraggableModifierInput from "../input/DraggableModifierInput.vue";

let lastVolumeBeforeMute = amethyst.player.volume.value;

const handleContextCoverMenu = ({ x, y }: MouseEvent) => {
  useContextMenu().open({ x, y }, [
    {
      title: "Inspect",
      icon: "mdi:flask",
      action: () => amethyst.player.getCurrentTrack() && useInspector().inspectAndShow(amethyst.player.getCurrentTrack()!)
    },
    { title: "Export cover...", icon: "ic:twotone-add-photo-alternate", action: () => amethyst.player.getCurrentTrack()?.exportCover() },
    amethyst.state.window.isShowingBigCover
      ? { title: "Hide cover", icon: "ic:twotone-remove-red-eye", action: () => amethyst.state.window.isShowingBigCover = false }
      : { title: "View cover", icon: "ic:twotone-remove-red-eye", action: () => amethyst.state.window.isShowingBigCover = true },
  ]);
};

const handleSeekMouseScroll = (e: WheelEvent) => {
  const delta = Math.sign(e.deltaY);
  const fineTuneStep = 1;
  const normalTuneStep = 5;
  const bigTuneStep = 20;

  if (e.altKey)
    delta < 0 ? amethyst.player.seekForward(fineTuneStep) : amethyst.player.seekBackward(fineTuneStep);
  else if (e.shiftKey)
    delta < 0 ? amethyst.player.seekForward(bigTuneStep) : amethyst.player.seekBackward(bigTuneStep);
  else
    delta < 0 ? amethyst.player.seekForward(normalTuneStep) : amethyst.player.seekBackward(normalTuneStep);
};

const handleVolumeMouseScroll = (e: WheelEvent) => {
  const delta = Math.sign(e.deltaY);
  const fineTuneStep = 0.01;
  const normalTuneStep = 0.05;

  if (e.altKey)
    delta > 0 ? amethyst.player.volumeDown(fineTuneStep) : amethyst.player.volumeUp(fineTuneStep);
  else
    delta > 0 ? amethyst.player.volumeDown(normalTuneStep) : amethyst.player.volumeUp(normalTuneStep);
};

const editMeterContextMenuOption = (name :string) => [{ 
  title: `Edit ${name}`, 
  icon: "ic:twotone-edit", 
  action: () => router.push({ name: "settings.metering" }) 
}];

</script>

<template>
  <div
    class="absolute filter drop-shadow-xl pointer-events-none bottom-4 flex justify-center px-4 gap-2 w-full left-1/2 transform-gpu -translate-x-1/2 z-30 text-playback-controls-text"
  >
    <div
      v-if="amethyst.state.settings.value.showLoudnessMeter"
      :class="[!amethyst.state.settings.value.oscilloscope.show && 'max-w-304px']"
      class="flex pointer-events-auto items-center h-16 gap-2 rounded-8px w-full min-w-180px max-w-240px bg-playback-controls-background hide p-2"
      @contextmenu="useContextMenu().open({ x: $event.x, y: $event.y }, [
        { title: 'Hide loudness meter', icon: 'ic:twotone-remove-red-eye', action: () => amethyst.state.settings.value.showLoudnessMeter = false },
        ...editMeterContextMenuOption('loudness meter')
      ]);"
    >
      <loudness-meter
        :key="amethyst.player.nodeManager.getNodeConnectionsString()"
        :node="amethyst.player.nodeManager.master.pre"
      />
    </div>
    <!-- Spacer to keep the middle dock centered  -->
    <div
      v-else
      :class="[!amethyst.state.settings.value.oscilloscope.show && 'max-w-304px']"
      class="flex pointer-events-auto p-2 items-center h-16 gap-2 w-full xl:w-full max-w-180px select-none"
    />

    <div
      v-if="amethyst.state.settings.value.oscilloscope.show"
      class="flex pointer-events-auto overflow-hidden items-center justify-center h-16 gap-2 rounded-8px transition w-full min-w-64px max-w-64px bg-playback-controls-background"
      @contextmenu="useContextMenu().open({ x: $event.x, y: $event.y }, [
        { title: 'Hide oscilloscope', icon: 'ic:twotone-remove-red-eye', action: () => amethyst.state.settings.value.oscilloscope.show = false },
        ...editMeterContextMenuOption('oscilloscope')
      ]);"
    >
      <oscilloscope
        v-if="amethyst.state.settings.value.oscilloscope.show && amethyst.player.source"
        :key="amethyst.player.nodeManager.getNodeConnectionsString()"
        :node="amethyst.player.nodeManager.master.pre"
        :width="64"
        :height="64"
      />
    </div>

    <resizable-div
      name="playback-controls"
      side="centerVertical"
      :handles-visible="false"
      default-size="940px"
      class="relative rounded-8px min-w-660px max-w-940px  pointer-events-auto bg-playback-controls-background"
    >
      <div class="flex items-center h-16 gap-2 p-2 w-full">
        <Transition name="slide">
          <div 
            v-if="amethyst.state.settings.value.showOutputDiagram"
            class="flex gap-4 overflow-hidden items-center flex-col h-48 w-full bg-playback-controls-background absolute bottom-40px rounded-8px -z-5 left-0"
          >
            <icon
              icon="ic:twotone-keyboard-double-arrow-down"
              class="utilityButton cursor-pointer absolute mt-3"
              @click="amethyst.state.settings.value.showOutputDiagram = !amethyst.state.settings.value.showOutputDiagram"
            />
            <output-diagram class="p-4" />
          </div>
        </Transition>
        <slider
          id="seek"
          key="seek"
          v-model="amethyst.player.currentTime.value"
          class="w-full h-8 absolute -top-1.5 hover:-top-3 w-full left-0 -z-1"
          :max="amethyst.player.input.duration"
          @input="amethyst.player.seekTo(amethyst.player.currentTime.value)"
          @wheel.passive="handleSeekMouseScroll"
        />
        <db-meter
          v-if="amethyst.state.settings.value.showDbMeter && amethyst.state.settings.value.decibelMeterSeparatePrePost && amethyst.player.source"
          :key="amethyst.player.nodeManager.getNodeConnectionsString()"
          class="duration-user-defined cursor-pointer"
          :node="amethyst.player.nodeManager.master.pre"
          pre
          :channels="amethyst.player.getCurrentTrack()?.getChannels()"
          @contextmenu="useContextMenu().open({ x: $event.x, y: $event.y }, [
            { title: 'Hide decibel meter', icon: 'ic:twotone-remove-red-eye', action: () => amethyst.state.settings.value.showDbMeter = false },
          ]);"
          @click="router.currentRoute.value.name === 'audio-monitor' ? router.back() : router.push({ name: 'audio-monitor' })"
        />
        <db-meter
          v-if="amethyst.state.settings.value.showDbMeter && amethyst.player.source"
          :key="amethyst.player.nodeManager.getNodeConnectionsString()"
          class="duration-user-defined cursor-pointer"
          :node="amethyst.player.nodeManager.master.post"
          post
          :channels="amethyst.player.getCurrentTrack()?.getChannels()"
          @contextmenu="useContextMenu().open({ x: $event.x, y: $event.y }, [
            { title: 'Hide decibel meter', icon: 'ic:twotone-remove-red-eye', action: () => amethyst.state.settings.value.showDbMeter = false },
          ]);"
          @click="router.currentRoute.value.name === 'audio-monitor' ? router.back() : router.push({ name: 'audio-monitor' })"
        />
        <cover-art
          v-if="amethyst.state.settings.value.showCoverArt"
          class="rounded-4px h-48px w-48px min-h-48px min-w-48px text-primary-900 border-1 border-transparent cursor-pointer hover:border-primary-800"
          :class="[
            amethyst.state.window.isShowingBigCover && 'border-primary-700'
          ]"
          :url="amethyst.player.getCurrentTrack()?.getCover()"
          @contextmenu="handleContextCoverMenu"
          @click="amethyst.player.getCurrentTrack()?.cover.state === LoadStatus.Loaded && (amethyst.state.window.isShowingBigCover = !amethyst.state.window.isShowingBigCover)"
        />

        <div class="flex justify-between select-none max-w-40 flex-col h-full w-full py-0.5 font-bold">
          <h1
            class="text-13px hover:underline cursor-external-pointer overflow-hidden overflow-ellipsis"
            @click=" amethyst.showItem(amethyst.player.getCurrentTrack()?.path!)"
          >
            {{ amethyst.player.getCurrentTrack()?.getTitleFormatted() || 'No track' }}
          </h1>
          <p class="text-11px overflow-hidden overflow-ellipsis">
            {{ amethyst.player.getCurrentTrack()?.getArtistsFormatted() || 'No artist' }}
          </p>
          <p class="text-11px text-text_subtitle">
            {{ amethyst.player.currentTimeFormatted(true) }} /
            {{ secondsToColinHuman(amethyst.player.input.duration) || '0:00' }}
          </p>
        </div>

        <playback-buttons :player="amethyst.player" />

        <draggable-modifier-input
          v-model="amethyst.player.pitchSemitones.value"
          :min="-12"
          :max="12"
          :step="0.01"
          suffix="st"
        />
        <icon
          icon="mdi:information-slab-box-outline"
          class="utilityButton transition-all"
          :class="[
            amethyst.state.settings.value.showOutputDiagram && 'text-accent'
          ]"
          @click="amethyst.state.settings.value.showOutputDiagram = !amethyst.state.settings.value.showOutputDiagram"
        />
        <icon
          icon="ic:twotone-waves"
          class="utilityButton"
          :class="[
            amethyst.state.settings.value.showLoudnessMeter && 'text-accent'
          ]"
          @click="amethyst.state.settings.value.showLoudnessMeter = !amethyst.state.settings.value.showLoudnessMeter"
        />
        <icon
          icon="ic:twotone-graphic-eq"
          class="utilityButton"
          :class="[
            amethyst.state.settings.value.showSpectrum && 'text-accent'
          ]"
          @click="amethyst.state.settings.value.showSpectrum = !amethyst.state.settings.value.showSpectrum"
        />
        <icon
          v-if="amethyst.player.volume.value > 0"
          icon="ic:round-volume-up"
          class="utilityButton"
          @click="lastVolumeBeforeMute = amethyst.player.volume.value; amethyst.player.setVolume(0);"
        />
        <icon
          v-else
          icon="ic:round-volume-off"
          class="utilityButton text-accent"
          @click="amethyst.player.setVolume(lastVolumeBeforeMute);"
        />
        <slider
          id="volume"
          key="volume"
          v-model="amethyst.player.volume.value"
          class="min-w-16 h-1.5"
          min="0"
          max="1"
          step="0.001"
          @input="amethyst.player.setVolume(amethyst.player.volume.value)"
          @wheel.passive="handleVolumeMouseScroll"
        />
      </div>
    </resizable-div>
    <div
      v-if="amethyst.state.settings.value.showVectorscope"
      class="flex pointer-events-auto overflow-hidden items-center justify-center h-16 gap-2 rounded-8px transition w-full min-w-64px max-w-64px bg-playback-controls-background"
      @contextmenu="useContextMenu().open({ x: $event.x, y: $event.y }, [
        { title: 'Hide vectorscope', icon: 'ic:twotone-remove-red-eye', action: () => amethyst.state.settings.value.showVectorscope = false },
        ...editMeterContextMenuOption('vectorscope')
      ]);"
    >
      <vectorscope
        v-if="amethyst.state.settings.value.showVectorscope && amethyst.player.source"
        :key="amethyst.player.nodeManager.getNodeConnectionsString()"
        :node="amethyst.player.nodeManager.master.pre"
        :width="64"
        :height="64"
      />
    </div>

    <div
      v-if="amethyst.state.settings.value.showSpectrum"
      :class="[!amethyst.state.settings.value.showVectorscope && 'max-w-304px']"
      class="flex pointer-events-auto overflow-hidden items-center h-16 gap-2 rounded-8px transition w-full min-w-180px max-w-240px bg-playback-controls-background hide"
      @contextmenu="useContextMenu().open({ x: $event.x, y: $event.y }, [
        { title: 'Hide spectrum analyzer', icon: 'ic:twotone-remove-red-eye', action: () => amethyst.state.settings.value.showSpectrum = false },
        ...editMeterContextMenuOption('spectrum analyzer')
      ]);"
      @click="amethyst.state.settings.value.showBigSpectrum = true"
    >
      <spectrum-analyzer
        :key="amethyst.player.nodeManager.getNodeConnectionsString()"
        :node="amethyst.player.nodeManager.master.pre"
        :fft-size="amethyst.state.settings.value.spectrumFftSize"
        :smoothing="amethyst.state.settings.value.spectrumSmoothing"
        :spectrogram="amethyst.state.settings.value.spectrogram.show"
        :accent-color="getThemeColor('--accent')"
        :paused="amethyst.shouldPauseVisualizers()"
      />
    </div>
    <!-- Spacer to keep the middle dock centered  -->
    <div
      v-else
      :class="[!amethyst.state.settings.value.showVectorscope && 'max-w-304px']"
      class="flex pointer-events-auto p-2 items-center h-16 gap-2 w-full xl:w-full max-w-180px select-none"
    />
  </div>
</template>

<style scoped lang="postcss">
.utilityButton {
  @apply w-5 min-w-5 h-5 min-h-5 opacity-75 hover:opacity-100;
}

@media only screen and (max-width: 1200px) {
  .hide {
    @apply min-w-0px max-w-0px p-0;
  }
}

.slide-enter-active {
  transition: all 0.2s ease-out;
}

.slide-leave-active {
  transition: all 0.2s ease-in;
}

.slide-enter-from,
.slide-leave-to {
  height: 0px;
}

</style>
