// /* eslint-disable no-console */
// import { Player } from "@/oldplayer";
// import { IAudioMetadata } from "music-metadata";

// export class WaveformRenderer {
//   public canvas: HTMLCanvasElement;

//   private audioBuffer: AudioBuffer | null;
//   private audioCtx: AudioContext;
//   private currentWorker: Worker | null;

//   constructor(public player: Player, canvasSelector: string) {
//     this.canvas = document.querySelector(canvasSelector) || document.createElement("canvas");
//     this.audioCtx = new AudioContext();
//     this.audioBuffer = null;
//     this.currentWorker = null;

//     this.player.on("metadata", async metadata => {
//       this.player.Store.state.processQueue.add(metadata.file);
//       // TODO: refactor this system so amethyst automatically determines when processing has finished from child plugins
//       await this.handlePlayAudio(metadata);
//       this.player.Store.state.processQueue.delete(metadata.file);
//     });
//   }

//   private handlePlayAudio = async (metadata: { file: string } & IAudioMetadata) => {
//     const existingRender = this.player.Store.state.waveformCache[metadata.file];
//     if (existingRender) return this.drawImage(existingRender);

//     const currentSound = this.player.state.currentlyPlayingFilePath;
//     if (currentSound != this.player.state.currentlyPlayingFilePath) return;

//     const channels = metadata.format.numberOfChannels ?? 2;
//     const duration = metadata.format.duration ?? 1;
//     const sampleRate = this.player.state.source?.context.sampleRate ?? 44100;

//     const offlineAudioCtx = new OfflineAudioContext({
//       numberOfChannels: channels,
//       length: duration * sampleRate,
//       sampleRate
//     });

//     const tempBuffer = await this.fetchAudioBuffer(this.player.state.currentlyPlayingFilePath, offlineAudioCtx);
//     if (!tempBuffer) {
//       Promise.reject();
//       return;
//     }
//     if (currentSound != this.player.state.currentlyPlayingFilePath) return;

//     this.audioBuffer = tempBuffer;
//     await this.renderWaveform(metadata.file);
//   };

//   private setCanvasSize = () => {
//     this.canvas.width = 3840 / 8;
//     this.canvas.height = 128;
//   };

//   private fetchAudioBuffer = (src: string, offlineAudioCtx: OfflineAudioContext): Promise<AudioBuffer> => {
//     const source = offlineAudioCtx.createBufferSource();
//     const request = new XMLHttpRequest();
//     request.open("GET", src, true);
//     request.responseType = "arraybuffer";

//     return new Promise<AudioBuffer>((resolve, reject) => {
//       request.onload = () => {
//         const audioData = request.response;

//         this.audioCtx.decodeAudioData(audioData)
//           .then((buffer: AudioBuffer) => {
//             const myBuffer = buffer;
//             source.buffer = myBuffer;
//             source.connect(offlineAudioCtx.destination);
//             source.start();

//             offlineAudioCtx.startRendering()
//               .then(resolve)
//               .catch(reject);
//           });
//       };

//       request.send();
//     });
//   };

//   private renderWaveform = async (filePath: string) => {
//     return new Promise<void>((resolve, reject) => {
//       this.setCanvasSize();
//       const backCanvas = document.createElement("canvas");
//       backCanvas.width = this.canvas.width;
//       backCanvas.height = this.canvas.height;

//       // Electron 18.0.3 is using Chrome 100.0.4896.75
//       // https://www.electronjs.org/releases/stable?version=18&page=2#18.0.3
//       //
//       // transferControlToOffscreen has been available since Chrome 69
//       // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/transferControlToOffscreen#browser_compatibility
//       // @ts-ignore
//       const offscreen: OffscreenCanvas = backCanvas.transferControlToOffscreen();

//       if (this.audioBuffer === null) return reject();

//       const audioData = this.audioBuffer.getChannelData(0);

//       if (this.currentWorker !== null) {
//         this.currentWorker.postMessage({ stop: true });
//         this.currentWorker.terminate();
//         reject();
//       }

//       // Worker was not being bundled when building.
//       // https://webpack.js.org/guides/web-workers/
//       // https://github.com/vitejs/vite/issues/4642
//       // @ts-ignore
//       this.currentWorker = new Worker(new URL("./workers/waveformRenderWorker.ts", import.meta.url));
//       this.currentWorker.postMessage({ canvas: offscreen, audioData }, [offscreen]);
//       this.currentWorker.onmessage = ({ data }) => {
//         this.drawImage(data);
//         this.player.Store.state.waveformCache[filePath] = data;
//         this.currentWorker = null;
//         resolve();
//       };
//     });
//   };

//   public clean = () => {
//     this.player.off("metadata");
//   };

//   public drawImage = (data: ImageBitmap) => {
//     const ctx = this.canvas.getContext("2d")!;
//     ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//     try {
//       ctx.drawImage(data, 0, 0);
//     } catch (error) {
//       console.log(error);

//       // we don't care about it not being able to render the last frame, its better to ignore this than to check for it every frame 
//     }
//   };
// }