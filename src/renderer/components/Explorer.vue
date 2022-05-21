<script setup lang="ts">
import { useState } from "../state";
const state = useState();
</script>

<template>
  <div class="min-w-48 max-w-48 p-2 flex h-full overflow-hidden overflow-y-scroll ">
    <ul>
      <li v-for="(song, i) of state.queue" :key="song">
        <p class="font-cozette hover:text-blue-300 cursor-default text-[11px] max-w-40 overflow-hidden overflow-ellipsis whitespace-nowrap" @click="state.currentlyPlaying = i">
          {{ song.substring(song.lastIndexOf("\\") + 1) }}
        </p>
      </li>
    </ul>
  </div>
</template>

