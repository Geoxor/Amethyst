<template>
  <div class="w-64 bg-dark-900 text-social-text text-xs p-4">
    <div class="flex gap-4">
      <span class="whitespace-nowrap">Room ID: </span>
      <input
      v-model="roomId"
        class="bg-dark-700 w-full border-0 ring-offset-2 focus:ring-2 ring-primary focus:bg-dark-800 ring-offset-dark-900" />
      <button class="cursor-pointer" @click="handleJoinLeave">
        {{ state.state.roomId !== undefined ? 'Leave' : 'Join' }}
      </button>
    </div>
    <div class="mt-2" v-if="!state.state.roomId">
      <span class="text-xs">Friends</span>
      <div class="text-center">
        <span class="italic text-primary text-opacity-50">You have no friends :forgortroll:</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useState, useSync } from '../amethyst';

import { ref } from 'vue';
const state = useState();
const roomId = ref("");
const sync = useSync();

const handleJoinLeave = () => {
  if (state.state.roomId === undefined) {
    state.state.roomId = roomId.value;
    try {
      sync.joinRoom(state.state.roomId);
    } catch (e) {
      console.error(e);
    }
  } else {
    state.roomSocket?.close();
    state.state.roomId = undefined;
  }
}
</script>

<style scoped lang="postcss">
</style>