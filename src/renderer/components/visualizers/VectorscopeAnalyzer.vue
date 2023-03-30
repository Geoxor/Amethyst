<script setup lang="ts">
import { useState } from "@/amethyst";
import { getThemeColorHex } from "@/logic/color";
import { onMounted, onUnmounted, watch } from "vue";

const props = defineProps<{ node: AudioNode, width: number, height: number }>();
const state = useState();
const randomId = Date.now();
let canvasCtx: CanvasRenderingContext2D;
let shouldStopRendering = false;

onMounted(() => {
  const vectorscope = document.querySelector(`#vectorscope-${randomId}`) as HTMLCanvasElement;
  canvasCtx = vectorscope.getContext("2d")!;
  canvasCtx.strokeStyle = `${getThemeColorHex("--primary-800")}99`;
  canvasCtx.lineWidth = state.settings.value.vectorscopeLineThickness;
  watch(() => state.settings.value.vectorscopeLineThickness, () => canvasCtx.lineWidth = state.settings.value.vectorscopeLineThickness);

  const { context } = props.node;
  const analyzerX = context.createAnalyser();
  const analyzerY = context.createAnalyser();
  analyzerX.fftSize = state.settings.value.vectorscopeFftSize;
  analyzerY.fftSize = state.settings.value.vectorscopeFftSize;
  let bufferX = new Float32Array(analyzerX.fftSize);
  let bufferY = new Float32Array(analyzerY.fftSize);

	watch(() => state.settings.value.vectorscopeFftSize, value => {
    analyzerX.fftSize = value;
    analyzerY.fftSize = value;
    bufferX = new Float32Array(value);
    bufferY = new Float32Array(value);
  });

  const splitter = context.createChannelSplitter(2);
  props.node.connect(splitter);
  splitter.connect(analyzerX, 0, 0);
  splitter.connect(analyzerY, 1, 0);

  let lastPosition = [props.width / 2, props.height / 2];

  function draw() {
    analyzerX.getFloatTimeDomainData(bufferX);
    analyzerY.getFloatTimeDomainData(bufferY);

    canvasCtx.clearRect(0, 0, screen.width, screen.height);
    for (let i = 0; i < bufferX.length; i++) {
      canvasCtx.beginPath();
      canvasCtx.moveTo(lastPosition[0], lastPosition[1]);

      const x = bufferX[i] * (props.width / 2.25) + props.width / 2;
      const y = bufferY[i] * (props.height / 2.25) + props.height / 2;

      canvasCtx.lineTo(x, y);
      canvasCtx.stroke();
      lastPosition = [x, y];
    }

    !shouldStopRendering && requestAnimationFrame(draw);
  }

  draw();
});

onUnmounted(() => shouldStopRendering = true);
</script>

<template>
  <div
    :style="`min-width: ${width}px;`"
    class="flex flex-col bg-surface-900 rounded-4px overflow-hidden"
  >
    <canvas
      :id="`vectorscope-${randomId}`"
      :class="[state.settings.value.lissajousVectorscope && 'lissajous']"
      :width="width"
      :height="height"
    />
  </div>
</template>

<style scoped lang="postcss">
.lissajous {
	@apply transform rotate-45 scale-66 rounded-4px bg-black bg-opacity-25;
}
</style>