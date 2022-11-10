<script setup lang="ts">
// import MetronomeIcon from "@/icons/plumpy/MetronomeIcon.vue";
// import KeyClefIcon from "@/icons/plumpy/KeyClefIcon.vue";
// import StorageIcon from "@/icons/plumpy/StorageIcon.vue";
import { useState } from "@/amethyst";
import Cover from "@/components/CoverArt.vue";
import Slider from "@/components/input/BaseSlider.vue";
import Chip from "@/components/new/BaseChip.vue";
import BitrateIcon from "@/icons/plumpy/BitrateIcon.vue";
import FileIcon from "@/icons/plumpy/FileIcon.vue";
// import HeartIcon from "@/icons/plumpy/HeartIcon.vue";
import NextIcon from "@/icons/plumpy/NextIcon.vue";
import PauseIcon from "@/icons/plumpy/PauseIcon.vue";
import PlayIcon from "@/icons/plumpy/PlayIcon.vue";
import RepeatIcon from "@/icons/plumpy/RepeatIcon.vue";
import RepeatOneIcon from "@/icons/plumpy/RepeatOneIcon.vue";
import ShuffleIcon from "@/icons/plumpy/ShuffleIcon.vue";
import { LoopMode, Player } from "@/logic/player";
import { computed } from "vue";
const state = useState();

const invoke = window.electron.ipcRenderer.invoke;
const props = defineProps<{ player: Player, }>();
const handleVolumeMouseScroll = (e: WheelEvent) => {
  const delta = Math.sign(e.deltaY);
  delta > 0 ? props.player.volumeDown() : props.player.volumeUp();
};

const handleSeekMouseScroll = (e: WheelEvent) => {
  const delta = Math.sign(e.deltaY);
  delta < 0 ? props.player.seekForward() : props.player.seekBackward();
};

const metadata = computed(() => props.player.getCurrentTrack()?.isLoaded ? props.player.getCurrentTrack()?.getMetadata() : undefined);
const duration = computed(() => metadata.value?.format.duration || 0);
</script>

<template>
  <div class="flex flex-col gap-2 justify-between h-full w-full">
    <div class="flex gap-2 items-center justify-between">
      <div class="flex text-primary-800 gap-2">
        <!-- <playlist-icon class="opacity-75 hover:opacity-100 hover:text-white" /> -->
        <next-icon
          class="opacity-75 hover:opacity-100 hover:text-white transform-gpu rotate-180"
          @click="player.previous()"
        />
        <pause-icon
          v-if="player.isPlaying.value"
          class="opacity-75 hover:opacity-100 hover:text-white"
          @click="player.pause()"
        />
        <play-icon
          v-else
          class="opacity-75 hover:opacity-100 hover:text-white"
          @click="player.play()"
        />
        <next-icon
          class="opacity-75 hover:opacity-100 hover:text-white"
          @click="player.next()"
        />

        <shuffle-icon
          class="opacity-75 hover:opacity-100 hover:text-white"
          @click="player.queue.shuffle()"
        />

        <repeat-icon
          v-if="player.loopMode.value == LoopMode.None"
          class="opacity-75 hover:opacity-100 hover:text-white"
          @click="player.loopAll()"
        />

        <repeat-icon
          v-if="player.loopMode.value == LoopMode.All"
          class="opacity-100 text-gray-300 hover:text-white"
          @click="player.loopOne()"
        />

        <repeat-one-icon
          v-if="player.loopMode.value == LoopMode.One"
          class="opacity-100 text-gray-300 hover:text-white"
          @click="player.loopNone()"
        />
      </div>

      <slider
        :id="player.currentTime"
        v-model="player.input.currentTime"
        :value="player.input.currentTime"
        class="w-full"
        min="0"
        :max="duration"
        step="0.01"
        @wheel.stop="handleSeekMouseScroll"
      />

      <p class="text-8px">
        {{ player.currentTimeFormatted() }} /
        {{ player.currentDurationFormatted() }}
      </p>

      <slider
        id="volume"
        key="volume"
        v-model="player.volume.value"
        class="max-w-32"
        min="0"
        max="1"
        step="0.001"
        @input="player.setVolume(player.volume.value)"
        @wheel="handleVolumeMouseScroll"
      />
    </div>
    <div 
      v-if="player.getCurrentTrack()?.isLoaded"
      class="flex items-center justify-between gap-3 tracking-wider h-12"
    >
      <div class="flex gap-2 items-center w-full">
        <cover
          v-if="state.settings.showCoverArt" 
          class="rounded-4px w-12 h-12 min-h-12 min-w-12"
          :url="player.getCurrentTrack()!.getCover() || state.state.defaultCover"
        />
        <div class="flex flex-col font-bold gap-2">
          <h1
            class="text-12px hover:underline cursor-pointer"
            @click="invoke('show-item', [player.getCurrentTrack()!.path])"
          >
            {{ player.getCurrentTrack()!.getTitleFormatted() }}
          </h1>
          <p class="text-8px text-primary-900">
            {{ player.getCurrentTrack()!.getArtistsFormatted() }}
          </p>
        </div>
      </div>
      <div
        class="flex gap-1 text-8px font-bold"
      >
        <!-- <chip :icon="MetronomeIcon">
              128<strong class="opacity-50">bpm</strong>
            </chip>
            <chip :icon="KeyClefIcon">
              D# Pentatonic
            </chip> -->
        <chip
          v-if="player.getCurrentTrack()!.getMetadata()?.format.codec"
          :icon="FileIcon"
        >
          {{ player.getCurrentTrack()!.getMetadata()?.format.codec }}
        </chip>
        <chip
          v-if="player.getCurrentTrack()!.getMetadata()?.format.bitrate"
          :icon="BitrateIcon"
        >
          {{ ((player.getCurrentTrack()!.getMetadata()?.format.bitrate || 0) / 1024).toFixed(2) }}<strong
            class="opacity-50"
          >kbps</strong>
        </chip>
        <!-- <chip :icon="StorageIcon">
              {{(player.getFileSize())}}<strong class="opacity-50"> MB</strong>
            </chip> -->
      </div>
    </div>
  </div>
</template>
