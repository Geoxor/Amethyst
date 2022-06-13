<template>
  <div class="w-64 bg-dark-900 text-social-text text-xs p-4">
    <div class="flex gap-4">
      <span class="whitespace-nowrap">Lobby ID: </span>
      <input
      v-model="lobbyId"
        class="bg-dark-700 w-full border-0 ring-offset-2 focus:ring-2 ring-primary focus:bg-dark-800 ring-offset-dark-900" />
      <button class="cursor-pointer" @click="handleJoinLeave">
        {{ state.state.lobbyId !== undefined ? 'Leave' : 'Join' }}
      </button>
    </div>
    <div class="mt-2" v-if="!state.state.lobbyId">
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
const lobbyId = ref("");
const sync = useSync();

const handleJoinLeave = () => {
  if (state.state.lobbyId === undefined) {
    state.state.lobbyId = lobbyId.value;
    try {
      sync.joinLobby(state.state.lobbyId);
    } catch (e) {
      console.error(e);
    }
  } else {
    state.lobbySocket?.close();
    state.state.lobbyId = undefined;
  }
}
</script>

<style scoped lang="postcss">
</style>