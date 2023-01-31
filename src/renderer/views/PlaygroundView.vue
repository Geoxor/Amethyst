<script setup lang="ts">
import { calculateRT60ByDimensions } from "@/logic/acoustics";
import * as THREE from "three";
import { OrbitControls } from "@three-ts/orbit-controls";
import { onMounted, Ref, ref, watch } from "vue";
import SettingsModifier from "@/components/settings/SettingsModifier.vue";
const threeCanvas = ref() as Ref<HTMLCanvasElement>;
const getCanvasDimensions = () => {
  const {width, height} = threeCanvas.value.getBoundingClientRect();
  return {width, height};
};
const defaultWidth = 5.8;
const defaultHeight = 2.5;
const defaultLength = 13;
const width = ref(defaultWidth);
const height = ref(defaultHeight);
const length = ref(defaultLength);

onMounted(() => {
const {width: canvasWidth, height: canvasHeight} = getCanvasDimensions();

// Create scene
const scene = new THREE.Scene();

// Create camera
const camera = new THREE.OrthographicCamera( canvasWidth / - 2, canvasWidth / 2, canvasHeight / 2, canvasHeight / - 2, 1, 1000 );
// camera.position.z = 500;
camera.position.x = (width.value + length.value + 1000) / 2;
camera.position.y = (width.value + length.value + 1000) / 2;
camera.position.z = (width.value + length.value + 1000) / 2;
camera.rotation.x = -Math.PI / 4;
camera.rotation.y = Math.PI / 4;

// Create renderer
const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas.value, antialias: true, alpha: true });
renderer.setSize(canvasWidth, canvasHeight);

const controls = new OrbitControls(camera, renderer.domElement);

// Create room geometry
const generateGeometry = () => {
  return new THREE.BoxGeometry(width.value, height.value, length.value);
};

const material = new THREE.MeshNormalMaterial();

const geometry = generateGeometry();
const room = new THREE.Mesh(geometry, material);
// room.rotation.x = -Math.PI / 4;
// room.rotation.y = Math.PI / 4;
room.scale.set(10, 10, 10);
watch(() => width.value, () => room.geometry = generateGeometry());
watch(() => height.value, () => room.geometry = generateGeometry());
watch(() => length.value, () => room.geometry = generateGeometry());

// Add room to scene
scene.add(room);

// Create light
const light = new THREE.PointLight(0xffffff, 1, 1000);
light.position.set(0, 0, 1100);
scene.add(light);

// Render loop
const render = () => {
  requestAnimationFrame(render);
  controls.update();
  // Spin room
  room.rotation.y += 0.001;
  renderer.render(scene, camera);
};

render();
});

</script>

<template>
  <div class="text-12px p-2 w-full borderRight">
    <header class="italic opacity-50 text-primary-1000">
      This is the playground area, use this view to test out and develop components
    </header>
    
    <div class="flex gap-2 w-full  font-aseprite rounded-4px border-1 bg-surface-900 border-surface-500">
      <canvas
        ref="threeCanvas"
        class="w-48 h-32 bg-surface-800"
      />

      <div class="p-2 flex gap-2">
        <div class="flex flex-col gap-2">
          <SettingsModifier
            v-model="width"
            text="Width (m)"
            :min="0" 
            :step="0.01"
            :def="defaultWidth"
          />

          <SettingsModifier
            v-model="height"
            text="Height (m)"
            :min="0"
            :step="0.01"
            :def="defaultHeight"
          />

          <SettingsModifier
            v-model="length"
            text="Length (m)"
            :min="0"
            :step="0.01"
            :def="defaultLength"
          />
        </div>

        <div class="h-full w-px bg-surface-500" />

        RT60: ≈ {{ (calculateRT60ByDimensions({width, height, length}) / 100).toFixed(2) }} seconds
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
input {
  @apply bg-black text-white;
}
</style>