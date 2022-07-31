<script lang="ts" setup>
import { useState } from "../amethyst";
import ControlButtons from "./ControlButtons.vue";
import { useRoute } from "vue-router";
const state = useState();
const route = useRoute();
const playPop = () => {
  new Audio("./sounds/pop.flac").play();
};
</script>

<template>
  <div class="bg-[#0D0D0D] z-100 font-cozette drag text-14px select-none flex text-white justify-between items-center">
    <div class="flex no-drag h-full items-center">
      <img v-if="state.isDev.value" src="../icon-dev.png" class="transform active:rotate-360  active:scale-50 transition duration-200 cursor-heart-pointer ml-1 h-4" alt="" @click="playPop">
      <img v-else src="../icon.png" class="transform  active:rotate-360 active:scale-50 transition duration-200 cursor-heart-pointer ml-1 h-4" alt="" @click="playPop">
    </div>

    <p v-if="route.name !== 'preferences'" class="absolute left-1/2 transform-gpu -translate-x-1/2">
      Amethyst v{{ state.state.version }}
    </p>

    <p v-else>
      Preferences
    </p>

    <control-buttons />
  </div>
</template>

<style lang="postcss">
select::-ms-expand {
  display: none;
}
</style>
