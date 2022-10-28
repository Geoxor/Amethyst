/* eslint-disable no-console */
let stopRender = false;

function render(canvas: HTMLCanvasElement, audioData: Float32Array): ImageBitmap | undefined {
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#e08eff");
  gradient.addColorStop(0.5, "#868aff");
  gradient.addColorStop(1, "#e08eff");

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);

  let x = 0;
  let y = 0;
  // TODO: cache these vectors as tuples [[x, y], [x, y], [x, y]] to turn them to SVGs
  for (let i = 0; (i < audioData.length || stopRender); i++) {
    y = (audioData[i] * (canvas.height / 2)) + (canvas.height / 2);
    x = (i / audioData.length) * canvas.width;
    ctx.lineTo(x, y);
  }

  if (stopRender) return;

  ctx.stroke();

  try {
    // Need to create an image from the OffscreenCanvas to send it back to the main process.
    // https://developer.mozilla.org/en-US/docs/Web/API/OffScreenCanvas/transferToImageBitmap
    // @ts-ignore
    const img: ImageBitmap = canvas.transferToImageBitmap();
    return img;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

// TODO: make this transfer an array buffer instead of using postMessage, it's way faster to share pointers
onmessage = function (e: MessageEvent<{ canvas: HTMLCanvasElement, audioData: Float32Array, stop: boolean }>) {
  const canvas = e.data.canvas;
  const audioData = e.data.audioData;
  stopRender = e.data.stop;

  if (stopRender) return;

  const img = render(canvas, audioData);
  if (img) {
    this.postMessage(img);
  }
};
