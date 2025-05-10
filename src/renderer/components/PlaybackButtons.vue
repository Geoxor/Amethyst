<script setup lang="ts">
import { amethyst } from "@/amethyst.js";
import { LoopMode } from "@/logic/player";
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import BaseTooltip from "./BaseTooltip.vue";

const isCurrentTrackFavorited = computed(() => amethyst.player.getCurrentTrack()?.isFavorited);
</script>

<template>
  <div class="flex flex-col justify-between h-full w-full">
    <div
      :class="[amethyst.getCurrentPlatform() === 'mobile' ? 'rounded-full ' : 'rounded-[4px]']"
      class="absolute -top-1 left-[calc(50%-14px)] transform-gpu -translate-x-1/2 translate-y-1/2"
    >
      <div class="flex text-primary-800 gap-2 items-center">
        <!-- <icon
            icon="ic:round-favorite"
            class="h-5 w-5 opacity-75 hover:opacity-100"
            :class="[isCurrentTrackFavorited && 'text-primary']"
            @click="amethyst.player.getCurrentTrack()?.toggleFavorite()"
          /> -->
        <!-- <playlist-icon class="opacity-75 hover:opacity-100 " /> -->
        <base-tooltip
          :text="$t('playback_controls.favorite')"
          placement="top"
        >
          <icon
            v-if="!amethyst.player.getCurrentTrack()?.isFavorited"
            icon="ic:baseline-favorite-border"
            class="h-5 w-5 cursor-pointer opacity-75 hover:opacity-100 hover:text-text-title"
            @click.stop.prevent="amethyst.player.getCurrentTrack()?.toggleFavorite()"
          />
          <icon
            v-else
            icon="ic:twotone-favorite"
            class="h-5 w-5 cursor-pointer text-alert-color"
            @click.stop.prevent="amethyst.player.getCurrentTrack()?.toggleFavorite()"
          />
        </base-tooltip>
        <base-tooltip
          :text="$t('playback_controls.shuffle')"
          placement="top"
        >
          <icon
            icon="ic:round-shuffle"
            class="h-5 w-5 opacity-75 hover:opacity-100"
            @click="amethyst.player.shuffle()"
          />
        </base-tooltip>
        <icon
          icon="ic:round-skip-next"
          class="h-5 w-5 opacity-75 hover:opacity-100 transform-gpu rotate-180"
          @click="amethyst.player.previous()"
        />
        <div
          class="flex items-center bg-playback-controls-text text-playback-controls-background rounded-full p-2 hover:bg-accent hover:text-playback-controls-text"
          @click="amethyst.player.isPlaying.value ? amethyst.player.pause() : amethyst.player.play()"
        >
          <icon
            v-if="amethyst.player.isPlaying.value"
            icon="ic:round-pause"
            class="h-5 w-5 hover:opacity-100"
          />
          <icon
            v-else
            icon="ic:round-play-arrow"
            class="h-5 w-5 hover:opacity-100"
          />
        </div>
        <icon
          icon="ic:round-skip-next"
          class="h-5 w-5 opacity-75 hover:opacity-100"
          @click="amethyst.player.skip()"
        />
        <base-tooltip
          :text="$t('playback_controls.loop')"
          placement="top"
        >
          <icon
            v-if="amethyst.player.loopMode.value == LoopMode.None"
            icon="ic:round-repeat"
            class="h-5 w-5 opacity-75 hover:opacity-100"
            @click="amethyst.player.loopAll()"
          />
          <icon
            v-if="amethyst.player.loopMode.value == LoopMode.All"
            icon="ic:round-repeat"
            class="h-5 w-5 opacity-75 text-accent hover:opacity-100"
            @click="amethyst.player.loopOne()"
          />
          <icon
            v-if="amethyst.player.loopMode.value == LoopMode.One"
            icon="ic:round-repeat-one"
            class="h-5 w-5 opacity-75 text-accent hover:opacity-100"
            @click="amethyst.player.loopNone()"
          />
        </base-tooltip>

        <!-- <icon
            icon="ic:round-playlist-add"
            class="h-5 w-5 opacity-75 hover:opacity-100"
          /> -->
      </div>
    </div>
  </div>
</template>