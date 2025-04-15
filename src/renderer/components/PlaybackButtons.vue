<script setup lang="ts">
import { amethyst } from "@/amethyst";
import { HeartIcon, NextIcon, PauseIcon, PlayIcon, PlaylistIcon, RepeatAllIcon, RepeatNoneIcon, RepeatOneIcon, ShuffleIcon } from "@/icons";
import { LoopMode } from "@/logic/player";
import { computed } from "vue";

const isCurrentTrackFavorited = computed(() => amethyst.player.getCurrentTrack()?.isFavorited);

</script>

<template>
  <div class="flex gap-2 justify-between items-center h-full w-full text-playback-controls-text">
    <div class="flex flex-col justify-between h-full w-full">
      <div
        :class="[amethyst.getCurrentPlatform() === 'mobile' ? 'rounded-full ' : 'rounded-4px']"
        class="absolute -top-1 left-1/2 transform-gpu -translate-x-1/2 translate-y-1/2"
      >
        <div class="flex text-primary-800 gap-2 items-center">
          <HeartIcon
            class="h-5 w-5 opacity-75 hover:opacity-100"
            :class="[isCurrentTrackFavorited && 'text-primary']"
            @click="amethyst.player.getCurrentTrack()?.toggleFavorite()"
          />
          <!-- <playlist-icon class="opacity-75 hover:opacity-100 " /> -->
          <ShuffleIcon
            class="h-5 w-5 opacity-75 hover:opacity-100"
            @click="amethyst.player.shuffle()"
          />
          <NextIcon
            class="h-5 w-5 opacity-75 hover:opacity-100  transform-gpu rotate-180"
            @click="amethyst.player.previous()"
          />
          <div
            class="flex items-center bg-playback-controls-text text-white rounded-full p-2 hover:bg-accent hover:text-playback-controls-text"
            @click="amethyst.player.isPlaying.value ? amethyst.player.pause() : amethyst.player.play()"
          >
            <PauseIcon
              v-if="amethyst.player.isPlaying.value"
              class="h-5 w-5 opacity-75 hover:opacity-100"
            />
            <PlayIcon
              v-else
              class="h-5 w-5 opacity-75 hover:opacity-100"
            />
          </div>
          <NextIcon
            class="h-5 w-5 opacity-75 hover:opacity-100"
            @click="amethyst.player.skip()"
          />
          <RepeatAllIcon
            v-if="amethyst.player.loopMode.value == LoopMode.None"
            class="h-5 w-5 opacity-75 hover:opacity-100"
            @click="amethyst.player.loopAll()"
          />
          <RepeatOneIcon
            v-if="amethyst.player.loopMode.value == LoopMode.All"
            class="h-5 w-5 opacity-75  hover:opacity-100"
            @click="amethyst.player.loopOne()"
          />
          <RepeatNoneIcon
            v-if="amethyst.player.loopMode.value == LoopMode.One"
            class="h-5 w-5 opacity-75  hover:opacity-100"
            @click="amethyst.player.loopNone()"
          />
          <PlaylistIcon
            class="h-5 w-5 opacity-75 hover:opacity-100"
          />
        </div>
      </div>

      <div class="flex justify-between disable-select no-drag max-w-40">
        <div class="flex flex-col w-full py-1 font-bold gap-1">
          <h1
            class="text-13px hover:underline cursor-pointer overflow-hidden overflow-ellipsis"
            @click=" amethyst.showItem(amethyst.player.getCurrentTrack()?.path!)"
          >
            {{ amethyst.player.getCurrentTrack()?.getTitleFormatted() || 'No track' }}
          </h1>
          <p class="text-10px text-text_subtitle overflow-hidden overflow-ellipsis">
            {{ amethyst.player.getCurrentTrack()?.getArtistsFormatted() || 'No artist' }}
          </p>
        </div>
      </div>
      <div class="flex flex py-1 gap-2 items-start justify-between disable-select no-drag">
        <p class="text-10px text-subtitle">
          {{ amethyst.player.currentTimeFormatted(true) }} /
          {{ amethyst.player.getCurrentTrack()?.getDurationFormatted(true) || '0:00' }}
        </p>
      </div>
    </div>
  </div>
</template>