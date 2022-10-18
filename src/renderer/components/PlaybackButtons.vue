<template>
  <div class="flex">
    <playback-button :icon="ShuffleIcon" @pressed="player.shuffle()" />
    <playback-button :icon="SkipIcon" class="transform rotate-y-180" @pressed="player.previous()" />
    <playback-button :icon="PlayIcon" v-if="!player.state.isPlaying" @pressed="player.play()" />
    <playback-button :icon="PauseIcon" v-else @pressed="player.pause()" />
    <playback-button v-if="player.state.loopMode == LoopMode.None" :icon="RepeatIcon" @pressed="player.loopAll()" />
    <playback-button v-if="player.state.loopMode == LoopMode.All" :icon="RepeatOneIcon" @pressed="player.loopOne()" />
    <playback-button :icon="SkipIcon" @pressed="player.next()" />
    <playback-button :icon="StopIcon" @pressed="player.setCurrentlyPlayingIndex(0); player.pause()" />
  </div>
</template>

<script setup lang="ts">
import { LoopMode } from "../player";
import PlaybackButton from './input/PlaybackButton.vue';
import StopIcon from '../icons/StopIcon.vue';
import PlayIcon from '../icons/PlayIcon.vue';
import PauseIcon from "../icons/PauseIcon.vue";
import ShuffleIcon from '../icons/ShuffleIcon.vue';
import SkipIcon from '../icons/SkipIcon.vue';
import RepeatIcon from '../icons/RepeatIcon.vue';
import RepeatOneIcon from '../icons/RepeatOneIcon.vue';
import Player from '../player';
defineProps<{ player: Player }>();
</script>
