<script setup lang="ts">
import { amethyst } from "@/amethyst";
import { getThemeColorHex } from "@/logic/color";
import { onMounted, onUnmounted, watch } from "vue";

const props = defineProps<{ node: AudioNode, width: number, height: number }>();
const randomId = Date.now();
let canvasCtx: CanvasRenderingContext2D;
let shouldStopRendering = false;

onMounted(() => {
  const vectorscope = document.querySelector(`#vectorscope-${randomId}`) as HTMLCanvasElement;
  canvasCtx = vectorscope.getContext("2d")!;

  let strokeStyle = `${getThemeColorHex("--accent")}99`;
  canvasCtx.strokeStyle = strokeStyle;

  watch(() => amethyst.state.settings.value.theme, () => {
    // watch detects the change before the theme has actually been applied
    setTimeout(() => {
      strokeStyle = `${getThemeColorHex("--accent")}99`;
    }, 100);
  });

  canvasCtx.lineWidth = amethyst.state.settings.value.vectorscopeLineThickness;
  watch(() => amethyst.state.settings.value.vectorscopeLineThickness, () => canvasCtx.lineWidth = amethyst.state.settings.value.vectorscopeLineThickness);

  const { context } = props.node;
  const analyzerX = context.createAnalyser();
  const analyzerY = context.createAnalyser();
  analyzerX.fftSize = amethyst.state.settings.value.vectorscopeFftSize;
  analyzerY.fftSize = amethyst.state.settings.value.vectorscopeFftSize;
  let bufferX = new Float32Array(analyzerX.fftSize);
  let bufferY = new Float32Array(analyzerY.fftSize);

	watch(() => amethyst.state.settings.value.vectorscopeFftSize, value => {
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

  watch(() => amethyst.state.window.isFocused, isFocused => {
    if (amethyst.state.settings.value.pauseVisualsWhenUnfocused) {
      if (!isFocused) shouldStopRendering = true;
      else {
        shouldStopRendering = false;
        draw();
      }
    }
  });

  function draw() {
    analyzerX.getFloatTimeDomainData(bufferX);
    analyzerY.getFloatTimeDomainData(bufferY);

    canvasCtx.strokeStyle = strokeStyle;

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
  <canvas
    :id="`vectorscope-${randomId}`"
    :class="[amethyst.state.settings.value.lissajousVectorscope && 'lissajous bg-slider-background bg-opacity-50']"
    class="transform rotate-90"
    :width="width"
    :height="height"
  />
</template>

<style scoped lang="postcss">
.lissajous {
	@apply rotate-45 scale-70;
}
</style>