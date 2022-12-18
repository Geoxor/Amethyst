<script setup lang="ts">
import { useState } from "@/amethyst";
import { getThemeColorHex } from "@/logic/color";
import { computed, onMounted, onUnmounted, watch } from "vue";
const props = defineProps<{ node: AudioNode }>();
const FFT_SIZE = 512;
const WIDTH = 76;
const HEIGHT = WIDTH;
const state = useState();
let shouldStopRendering = false;
let randomId = Date.now();

onMounted(() => {
	const vectorscope = document.querySelector(`#vectorscope-${randomId}`) as HTMLCanvasElement;
	const canvasCtx = computed(() => {
		const canvas = vectorscope.getContext("2d")!;
		return canvas;
	});

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

	canvasCtx.value.strokeStyle = `${getThemeColorHex("--primary-800")}99`;

	canvasCtx.value.lineWidth = state.settings.vectorscopeLineThickness;
	watch(() => state.settings.vectorscopeLineThickness, () => canvasCtx.value.lineWidth = state.settings.vectorscopeLineThickness);

	let lastPosition = [WIDTH / 2, HEIGHT / 2];

	function draw() {
		analyzerX.getFloatTimeDomainData(bufferX);
		analyzerY.getFloatTimeDomainData(bufferY);

		canvasCtx.value.clearRect(0, 0, screen.width, screen.height);
		for (let i = 0; i < bufferX.length; i++) {
			canvasCtx.value.beginPath();
			canvasCtx.value.moveTo(lastPosition[0], lastPosition[1]);

			const x = bufferX[i] * 32 + WIDTH / 2;
			const y = bufferY[i] * 32 + HEIGHT / 2;

			canvasCtx.value.lineTo(x, y);
			canvasCtx.value.stroke();
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
    :style="`min-width: ${WIDTH}px;`"
    class="flex flex-col bg-surface-900 rounded-4px overflow-hidden"
  >
    <canvas
      :id="`vectorscope-${randomId}`"
      :class="[!state.settings.diagonalVectorscope && 'diagonal']"
      :width="WIDTH"
      :height="HEIGHT"
    />
  </div>
</template>

<style scoped lang="postcss">
.diagonal {
	@apply transform rotate-45 scale-66 rounded-4px bg-surface-1000;
}
</style>