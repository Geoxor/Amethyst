<script setup lang="ts">
import { useState } from "@/amethyst";
import { getThemeColorHex } from "@/logic/color";
import { onMounted, onUnmounted, watch } from "vue";

const props = defineProps<{ node: AudioNode, width: number, height: number }>();
const state = useState();
const FFT_SIZE = 512;
const randomId = Date.now();
let canvasCtx: CanvasRenderingContext2D;
let shouldStopRendering = false;

onMounted(() => {
  const vectorscope = document.querySelector(`#vectorscope-${randomId}`) as HTMLCanvasElement;
  canvasCtx = vectorscope.getContext("2d")!;
  canvasCtx.strokeStyle = `${getThemeColorHex("--primary-800")}99`;
  canvasCtx.lineWidth = state.settings.vectorscopeLineThickness;
  watch(() => state.settings.vectorscopeLineThickness, () => canvasCtx.lineWidth = state.settings.vectorscopeLineThickness);

  const { context } = props.node;
  const analyzerX = context.createAnalyser();
  const analyzerY = context.createAnalyser();
  analyzerX.fftSize = FFT_SIZE;
  analyzerY.fftSize = FFT_SIZE;

  const splitter = context.createChannelSplitter(2);
  props.node.connect(splitter);
  splitter.connect(analyzerX, 0, 0);
  splitter.connect(analyzerY, 1, 0);

  const bufferX = new Float32Array(analyzerX.fftSize);
  const bufferY = new Float32Array(analyzerY.fftSize);

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
      :class="[!state.settings.diagonalVectorscope && 'diagonal']"
      :width="width"
      :height="height"
    />
  </div>
</template>

<style scoped lang="postcss">
.diagonal {
	@apply transform rotate-45 scale-66 rounded-4px bg-black bg-opacity-25;
}
</style>