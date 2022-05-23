<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { onMounted, onUnmounted } from "vue";
const props = defineProps<{ node: MediaElementAudioSourceNode }>();
const SPECTRUM_WIDTH = 500;
const SPECTRUM_HEIGHT = 150;
const TILT_MULTIPLIER = 0.005; // 3dB/octave
const FFT_SIZE = 8192;
const VERTICAL_ZOOM_FACTOR = 1.5;

let shouldFuckOff = false;

const getLogIndex = (value: number, min: number, max: number) => {
	const exp = value / min / (max - min);
	return min * (max / min) ** exp;
};

const transformLogarithmic = (array: Uint8Array): Uint8Array => {
	const logArray = [];

	for (let i = 1; i < array.length; i++) {
		const idx = getLogIndex(i, 1, array.length - 1);
		const low = ~~idx;
		const high = Math.ceil(idx);
		const lv = array[low];
		const hv = array[high];
		const w = (idx - low) / (high - low);
		const v = lv + (hv - lv) * w;
		logArray.push(v);
	}

	return new Uint8Array(logArray);
};

onMounted(() => {
	const context = props.node.context;
	const gain = context.createGain();
	const analyser = context.createAnalyser();
	analyser.fftSize = FFT_SIZE;
	analyser.smoothingTimeConstant = 0.5;
	analyser.maxDecibels = 30;
	analyser.minDecibels = -120;

	props.node.connect(gain);
	// Raising the gain into the analyzer to compensate for the tilt bottom end loss
	gain.connect(analyser);

	const spectrum = document.querySelector("#spectrum") as HTMLCanvasElement;
	const canvasCtx = computed(() => {
		const canvas = spectrum.getContext("2d");

		if (canvas) {
			canvas.fillStyle = "#000";
			return canvas;
		}
		return canvas;
	});

	function draw() {
		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);

		canvasCtx.value?.clearRect(0, 0, screen.width, screen.height);
		analyser.getByteFrequencyData(dataArray);

		const logArray = transformLogarithmic(dataArray);
		const barWidth = SPECTRUM_WIDTH / logArray.length;
		const tiltOffset = TILT_MULTIPLIER * logArray.length;

		for (let i = 0; i < logArray.length; i++) {
			const tilt = (i * TILT_MULTIPLIER) - tiltOffset;
			const x = logArray[i] * VERTICAL_ZOOM_FACTOR;
			const barHeight = ((x + tilt) / 255 * SPECTRUM_HEIGHT);
			canvasCtx.value?.fillRect(i * barWidth, SPECTRUM_HEIGHT - barHeight, 1, barHeight);
		}

		!shouldFuckOff && requestAnimationFrame(draw);
	}

	draw();
});

onUnmounted(() => shouldFuckOff = true);
</script>

<template>
  <div class="w-min flex  flex-col">
    <canvas
      id="spectrum"
      ref="spectrum"
      :width="SPECTRUM_WIDTH"
      :height="SPECTRUM_HEIGHT"
    />
  </div>
</template>

