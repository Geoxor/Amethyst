<script setup lang="ts">
import { usePlayer } from "@/amethyst";

import LazyList from "@/components/LazyList.vue";
import {MyLocationIcon} from "@/icons/material";
import { ref } from "vue";
import SquareButton from "@/components//input/SquareButton.vue";
// import * as THREE from "three";
const player = usePlayer();

const filterText = ref("");

const scrollToCurrentElement = () => {
  const active = document.querySelector(".vue-recycle-scroller");
  const currentTrack = player.getCurrentTrack();
  if (!currentTrack) return;
  
  const estimatedPosition = player.queue.search(filterText.value).indexOf(currentTrack) * 16;
  active?.scrollTo({top: estimatedPosition, behavior: "smooth"});
};

// onMounted(() => {

// // init

// const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
// camera.position.z = 1;

// const scene = new THREE.Scene();

// const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
// const material = new THREE.MeshNormalMaterial();

// const mesh = new THREE.Mesh( geometry, material );
// scene.add( mesh );

// const renderer = new THREE.WebGLRenderer( { canvas: document.getElementById("three")!, antialias: true } );
// renderer.setAnimationLoop( animation );

// // animation

// function animation( time: number ) {

// 	mesh.rotation.x = time / 2000;
// 	mesh.rotation.y = time / 1000;

// 	renderer.render( scene, camera );
// }

//   animation(2);
// });

</script>

<template>
  <div class="flex-col p-2 flex w-full relative borderRight h-full ">
    <!-- <canvas
      id="three"
      width="400"
      height="200"
      class="w-100 h-50"
    /> -->
    <input
      v-model="filterText"
      type="text"
      class="border-2 z-30 select-none w-full bg-surface-800 border-surface-600 text-white py-0.25 placeholder-primary-900 placeholder-opacity-75 hover:placeholder-opacity-100 indent-xs text-12px mb-2"
      placeholder="name, album & artist..."
      @keydown.stop
    >

    <square-button
      class="absolute bottom-2 right-5 z-10 "
      :icon="MyLocationIcon"
      @click="scrollToCurrentElement"
    />

    <LazyList
      :tracks="player.queue.search(filterText)"
    />
  </div>
</template>

<style lang="postcss" scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

td {
  @apply overflow-hidden overflow-ellipsis;
}

</style>
