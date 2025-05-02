<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from "vue";
import * as THREE from "three";
import {logParabolicSpectrum} from "@/logic/math";
import {VISUALIZER_BIN_COUNT} from "@shared/constants";

const props = defineProps<{
  fragShader: string,
  analyser: AnalyserNode,
  vertexShader?: string,
  uniforms?: Record<string, any>,
  pauseRendering?: boolean,
  width?: number,
  height?: number,
}>();

const emit = defineEmits<{
  // Emitted before actual rendering to be able to update custom uniforms outside the component
  (e: "on-render", uniforms: Record<string, any>): void;
}>();

const shaderCanvas = ref<HTMLCanvasElement>();
let shouldDispose = false;

const getDimensions = () => {
  const bounds = shaderCanvas.value?.parentElement?.getBoundingClientRect();
  return {
    width: props.width || bounds?.width || 1,
    height: props.height || bounds?.height || 1
  };
};

onUnmounted(() => {
  shouldDispose = true;
});

onMounted(() => {
  if (!shaderCanvas.value) return;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera();
  const renderer = new THREE.WebGLRenderer({canvas: shaderCanvas.value});
  // Two render targets for double-buffering and the ability to use a backbuffer in shaders
  const renderTarget1 = new THREE.WebGLRenderTarget(1, 1);
  const renderTarget2 = new THREE.WebGLRenderTarget(1, 1);
  let currentTarget = renderTarget1;

  renderer.setRenderTarget(currentTarget);
  renderer.render(scene, camera);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      u_time: {value: 0},
      u_backbuffer: {value: null},
      u_resolution: {value: new THREE.Vector2()},
      u_amplitudes: {value: new Float32Array(VISUALIZER_BIN_COUNT)},
      ...props.uniforms,
    },
    vertexShader: props.vertexShader || `
      void main() {
        gl_Position = vec4(position, 1.0);
      }`,
    fragmentShader: props.fragShader
  });

  const geometry = new THREE.PlaneGeometry(2, 2);

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const render = () => {
    const { width, height } = getDimensions();
    renderer.setSize(width, height);
    renderTarget1.setSize(width, height);
    renderTarget2.setSize(width, height);

    material.uniforms.u_time.value += 0.01;
    material.uniforms.u_resolution.value.set(width, height);
    material.uniforms.u_backbuffer.value = currentTarget.texture;

    const spectrum = new Uint8Array(props.analyser.frequencyBinCount);
    props.analyser.getByteFrequencyData(spectrum);
    material.uniforms.u_amplitudes.value = logParabolicSpectrum(spectrum, VISUALIZER_BIN_COUNT);

    // Emitted to update custom uniforms before rendering
    emit("on-render", material.uniforms);

    const nextTarget = currentTarget === renderTarget1 ? renderTarget2 : renderTarget1;
    renderer.setRenderTarget(nextTarget);
    renderer.render(scene, camera);

    // Renders the output to canvas
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);

    currentTarget = nextTarget;

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

    // Clear when the shader changes
    renderer.setRenderTarget(renderTarget1);
    renderer.clear();
    renderer.setRenderTarget(renderTarget2);
    renderer.clear();
    renderer.setRenderTarget(null);
  });

  renderer.setAnimationLoop(render);
});
</script>

<template>
  <canvas ref="shaderCanvas" />
</template>