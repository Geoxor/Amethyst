import { useState } from "./amethyst";
import Player from "./player";


export class WaveformRenderer {
  public canvas: HTMLCanvasElement;

  private player: Player;
  private audioBuffer: AudioBuffer | null;
  private audioCtx: AudioContext;
  private currentWorker: Worker | null;

  constructor (player: Player, canvasSelector: string) {
    this.player = player;
    this.canvas = document.querySelector(canvasSelector) || document.createElement("canvas");
    this.audioCtx = new AudioContext();
    this.audioBuffer = null;
    this.currentWorker = null;
    const state = useState();

    this.player.on('play', async (filePath) => {
      // TODO: refactor this system so amethyst automatically determines when processing has finished from child plugins
      state.state.processQueue.add(filePath);
  
      try {
        await this.handlePlayAudio()
      } catch (error) {
        console.log(`Failed to render waveform for audio: ${filePath}`);
      } 

      state.state.processQueue.delete(filePath);
    });
  }

  private handlePlayAudio = async () => {
    const currentSound = this.player.state.sound;
    await this.waitForLoadedData(currentSound);

    if (currentSound != this.player.state.sound) return;
    
    const channels = this.player.state.source?.channelCount ?? 1;
    const duration = this.player.state.currentlyPlayingMetadata?.format.duration ?? 1;
    const sampleRate = this.player.state.currentlyPlayingMetadata?.format.sampleRate ?? 1;

    const offlineAudioCtx = new OfflineAudioContext({
      numberOfChannels: channels,
      length: duration * sampleRate,
      sampleRate
    });

    
    const tempBuffer = await this.fetchAudioBuffer(this.player.state.sound.src, offlineAudioCtx);
    if (currentSound != this.player.state.sound) return;

    this.audioBuffer = tempBuffer;
    await this.renderWaveform();
  };

  private setCanvasSize = () => {
    const parent = this.canvas.parentElement;
    if (parent) {
      const { width, height } = parent.getBoundingClientRect();
      this.canvas.width = width;
      this.canvas.height = height;
    }
  };

  private waitForLoadedData = async (audio: HTMLAudioElement) => {
    const loaded = new Promise<void>((resolve) => {
      const resolver = () => {
        audio.removeEventListener('loadeddata', resolver);
        resolve();
      }
      audio.addEventListener('loadeddata', resolver);
    });

    await loaded;
  };

  private fetchAudioBuffer = (src: string, offlineAudioCtx: OfflineAudioContext): Promise<AudioBuffer> => {
    const source = offlineAudioCtx.createBufferSource();
    const request = new XMLHttpRequest();

    request.open('GET', src, true);

    request.responseType = 'arraybuffer';

    return new Promise<AudioBuffer>((resolve, reject) => {
      request.onload = () => {
        var audioData = request.response;
  
        this.audioCtx.decodeAudioData(audioData)
          .then((buffer: AudioBuffer) => {
            const myBuffer = buffer;
            source.buffer = myBuffer;
            source.connect(offlineAudioCtx.destination);
            source.start();

            offlineAudioCtx.startRendering()
              .then(resolve)
              .catch(reject);
          });
      }
  
      request.send();
    })
  };

  private renderWaveform = async () => {
    return new Promise<void>((resolve, reject) => {
      this.setCanvasSize();
      const ctx = this.canvas.getContext('2d');
      ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const backCanvas = document.createElement('canvas');
      backCanvas.width = this.canvas.width;
      backCanvas.height = this.canvas.height;
  
      // Electron 18.0.3 is using Chrome 100.0.4896.75
      // https://www.electronjs.org/releases/stable?version=18&page=2#18.0.3
      //
      // transferControlToOffscreen has been available since Chrome 69
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/transferControlToOffscreen#browser_compatibility
      // @ts-ignore
      const offscreen: OffscreenCanvas = backCanvas.transferControlToOffscreen();
      
      if (this.audioBuffer === null) return reject();
  
      const audioData = this.audioBuffer.getChannelData(0);
  
      if (this.currentWorker !== null) {
        this.currentWorker.postMessage({ stop: true });
        this.currentWorker.terminate();
        reject();
      }
  
      this.currentWorker = new Worker("waveformRenderWorker.ts");
      this.currentWorker.postMessage({ canvas: offscreen, audioData }, [offscreen])

      // TODO: cache the analysis FFT data
      this.currentWorker.onmessage = ({data}) => {
        ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx?.drawImage(data, 0, 0);
        this.currentWorker = null;
        resolve();
      };
    })
  };

  public clean = () => {
    this.player.off('play', this.handlePlayAudio);
  };
}