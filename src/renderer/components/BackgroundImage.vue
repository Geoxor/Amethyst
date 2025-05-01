<script setup lang="ts">
import {amethyst} from "@/amethyst";
import CoverArt from "@/components/CoverArt.vue";
import * as THREE from "three";
import {onMounted, onUnmounted, ref, watch} from "vue";

const props = defineProps<{
  ambientBackgroundImage?: string,
  node: AudioNode
}>();

// Somewhat copied from the SpectrumAnalyzer component
// TODO: Maybe should make a dedicated shader component?
const shaderCanvas = ref<HTMLCanvasElement>();
let shouldStopRendering = false;

onMounted(() => {
  if (!shaderCanvas.value) return;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const renderer = new THREE.WebGLRenderer({canvas: shaderCanvas.value, alpha: true});

  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: {value: 0}
    },
    vertexShader: `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      void main() {
        gl_FragColor = vec4(0.5 + 0.5 * sin(time + gl_FragCoord.x / 256.0), 0.0, 0.0, 1.0);
      }
    `
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const animate = () => {
    if (shouldStopRendering) return;
    material.uniforms.time.value += 0.01;
    renderer.render(scene, camera);
  };

  const context = props.node.context;
  const analyser = context.createAnalyser();
  const gain = context.createGain();

  props.node.connect(gain);
  gain.connect(analyser);

  analyser.fftSize = amethyst.state.settings.value.spectrumFftSize;
  analyser.smoothingTimeConstant = amethyst.state.settings.value.spectrumSmoothing;
  watch(() => amethyst.state.settings.value.spectrumFftSize, () => analyser.fftSize = amethyst.state.settings.value.spectrumFftSize);
  watch(() => amethyst.state.settings.value.spectrumSmoothing, () => analyser.smoothingTimeConstant = amethyst.state.settings.value.spectrumSmoothing);

  // Don't change these
  analyser.maxDecibels = -0;
  analyser.minDecibels = -128;

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
});

onUnmounted(() => {
  shouldStopRendering = true;
});
</script>

<template>
  <div
    v-if="amethyst.state.settings.value.useShaderBackground"
    class="fixed top-0 left-0 w-full h-full z-0"
    :style="`
    mix-blend-mode: ${amethyst.state.settings.value.ambientBackgroundBlendMode};
    `"
  >
    <canvas
      ref="shaderCanvas"
      class="w-full h-full"
      :style="`
      opacity: ${amethyst.state.settings.value.ambientBackgroundOpacity}%;
      filter: blur(${amethyst.state.settings.value.ambientBackgroundBlurStrength}px);
      `"
    />
  </div>

  <div
    v-else-if="ambientBackgroundImage"
    :style="`
      transform: translate(-50%, -50%) scale(${amethyst.state.settings.value.ambientBackgroundZoom}%);
      mix-blend-mode: ${amethyst.state.settings.value.ambientBackgroundBlendMode};
    `"
    class="absolute z-1000 select-none pointer-events-none top-1/2 transform-gpu -translate-y-1/2 left-1/2 -translate-x-1/2 w-full"
  >
    <cover-art
      class="w-full h-full"
      :class="[
        amethyst.state.settings.value.ambientBackgroundSpin && 'animate-spin'
      ]"
      :style="`
      animation-play-amethyst.state: ${amethyst.state.settings.value.pauseVisualsWhenUnfocused && !amethyst.state.window.isFocused ? 'paused' : 'running'};
      animation-duration: ${amethyst.state.settings.value.ambientBackgroundSpinSpeed}s;
      opacity: ${amethyst.state.settings.value.ambientBackgroundOpacity}%;
      filter: blur(${amethyst.state.settings.value.ambientBackgroundBlurStrength}px);
    `"
      :url="ambientBackgroundImage"
    />
  </div>
</template>

<style scoped lang="postcss">

</style>