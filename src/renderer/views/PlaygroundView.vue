<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";

import * as THREE from "three";
import { usePlayer } from "@/amethyst";
import { scaleLog } from "@/logic/math";

const threeCanvas = ref() as Ref<HTMLCanvasElement>;

const cube = (width: number = 1.0, offset: number = 1.0): THREE.Vector3[] => {
  const vertices: THREE.Vector3[] = [];

  // 1
  // |\ 
  // | \
  // |  \
  // |___\
  // 0    2

  vertices.push(new THREE.Vector3(0.0 * width + offset, 0.0, 0.0) ); // 0
  vertices.push(new THREE.Vector3(0.0 * width + offset, 1.0, 0.0) ); // 1
  vertices.push(new THREE.Vector3(1.0 * width + offset, 0.0, 0.0) ); // 2

  // 0_____1
  //  \   |
  //   \  |
  //    \ |
  //     \|
  //      2

  vertices.push(new THREE.Vector3(0.0 * width + offset, 1.0, 0.0) ); // 0
  vertices.push(new THREE.Vector3(1.0 * width + offset, 1.0, 0.0) ); // 1
  vertices.push(new THREE.Vector3(1.0 * width + offset, 0.0, 0.0) ); // 2
  
  return vertices;
};

onMounted(async () => {
const loader = new THREE.FileLoader();
  const width = threeCanvas.value.getBoundingClientRect().width;
  const height = threeCanvas.value.getBoundingClientRect().height;
  const camera = new THREE.OrthographicCamera(0, 8.52, -550, 0, 0, 10000 );
  camera.position.set( 0, 0, 1);
  // camera.position.z = 1;
  // camera.position.x = 5;
  // camera.position.y = 1.5;
  const scene = new THREE.Scene();
  // init

  // const geometry = new THREE.PlaneGeometry(1.0, 1.0);
  const geometry = new THREE.BufferGeometry().setFromPoints([]);
  const vertices: THREE.Vector3[] = [];
  const indexes = [];
  const uniformData = {
    u_amplitude:  {        
      type: "iv1", 
      value: [] as number[]
    },
  };

  for (let i = 0; i < 2048; i++) {
    vertices.push(...cube(0.025, i * (0.025)));
    for (let j = 0; j < 3; j++) {
      indexes.push(i);
    }

    // Add to amplitude array a default number
    uniformData.u_amplitude.value.push(1.0);
  }

  geometry.setFromPoints(vertices);
  geometry.setAttribute("idx", new THREE.BufferAttribute(new Uint16Array(indexes), 3));

  const material = new THREE.ShaderMaterial({
    wireframe: true,
    transparent: true,
    uniforms: uniformData,
    fragmentShader: await loader.loadAsync("../shaders/SpectrumFrag.glsl") as string,
    vertexShader: await loader.loadAsync("../shaders/SpectrumVertex.glsl") as string,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas.value, antialias: true });
  renderer.setAnimationLoop(animation);
  renderer.setSize(width, height);

  // animation
  const context = usePlayer().nodeManager.master.node.context;
  const analyser = context.createAnalyser();
  const gain = context.createGain();
	usePlayer().nodeManager.master.node.connect(gain);
  gain.gain.value = 24;
	gain.connect(analyser);

	analyser.fftSize = 4096;
	analyser.smoothingTimeConstant = 0.7;

	// Don't change these
	analyser.maxDecibels = 30;
	analyser.minDecibels = -120;

  function animation() {

		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);

		analyser.getByteFrequencyData(dataArray);

		const points = scaleLog(dataArray);

    Array.from(points).forEach((value, idx) => {
      uniformData.u_amplitude.value[idx] = value ** 1.15;
    });

    // mesh.rotation.x = time / 2000;
    // mesh.rotation.y = time / 1000;

    renderer.render(scene, camera);
  }

  animation();
});

</script>

<template>
  <div class="text-12px p-2 w-full borderRight">
    <header class="italic opacity-50 text-primary-1000">
      This is the playground area, use this view to test out and develop components
    </header>
    <canvas
      ref="threeCanvas"
      class="w-full h-full"
    />
  </div>
</template>

<style scoped lang="postcss">

</style>