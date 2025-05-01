<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from "vue";
import * as THREE from "three";
import {logParabolicSpectrum} from "@/logic/math";

const props = defineProps<{
  fragShader: string,
  analyser: AnalyserNode,
  uniforms?: Record<string, any>,
  pauseRendering?: boolean,
  // TODO: Maybe add optional vertex shader?
}>();

const emit = defineEmits<{
  // Emitted before actual rendering to be able to update custom uniforms outside the component
  (e: "on-render", uniforms: Record<string, any>): void;
}>();

const shaderCanvas = ref<HTMLCanvasElement>();
let shouldDispose = false;

const BIN_COUNT = 960;

const getDimensions = () => {
  const bounds = shaderCanvas.value?.parentElement?.getBoundingClientRect();
  if (!bounds) return { width: 1, height: 1 };
  return { width: bounds.width, height: bounds.height };
};

onUnmounted(() => {
  shouldDispose = true;
});

onMounted(() => {
  if (!shaderCanvas.value) return;

  const { width, height } = getDimensions();
  if (!width || !height) return;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const renderer = new THREE.WebGLRenderer({canvas: shaderCanvas.value});

  const material = new THREE.ShaderMaterial({
    uniforms: {
      u_time: {value: 0},
      u_resolution: {value: new THREE.Vector2()},
      u_amplitudes: {value: new Float32Array(BIN_COUNT)},
      ...props.uniforms,
    },
    vertexShader: `
      void main() {
        gl_Position = vec4(position, 1.0);
      }`,
    fragmentShader: props.fragShader
  });

  const geometry = new THREE.PlaneGeometry(2, 2);

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const render = () => {
    material.uniforms.u_time.value += 0.01;
    const { width, height } = getDimensions();
    renderer.setSize(width, height);
    material.uniforms.u_resolution.value.set(width, height);
    const spectrum = new Uint8Array(props.analyser.frequencyBinCount);
    props.analyser.getByteFrequencyData(spectrum);
    material.uniforms.u_amplitudes.value = logParabolicSpectrum(spectrum, BIN_COUNT);
    // Emitted to update custom uniforms before rendering
    emit("on-render", material.uniforms);
    renderer.render(scene, camera);

    if (shouldDispose) {
      renderer.dispose();
      renderer.forceContextLoss();
      geometry.dispose();
      material.dispose();
      renderer.setAnimationLoop(null);
    }
  };

  watch(() => props.pauseRendering, () => {
    if (props.pauseRendering) {
      renderer.setAnimationLoop(null);
    } else {
      renderer.setAnimationLoop(render);
    }
  });

  watch(() => props.fragShader, () => {
    material.fragmentShader = props.fragShader;
    material.needsUpdate = true;
  });

  renderer.setAnimationLoop(render);
});
</script>

<template>
  <canvas
    ref="shaderCanvas"
    class="absolute w-full h-full"
  />
</template>