import type { RtAudioDeviceInfo } from "audify";
import { watch } from "vue";

import { type Amethyst,amethyst} from "@/amethyst.js";
import { AmethystAudioNode } from "@/logic/audio.js";
import type { NodeProperties } from "@/logic/audioManager.js";
import { floatToInt16 } from "@/logic/math.js";

import component from "./component.vue";

let hasWorkletStarted = false;
let captureNode: AudioWorkletNode;

let paused = false;

const createRealtimeNode = (context: AudioContext, pre: GainNode ) => {

  window.electron.ipcRenderer.on("pause-audio-worklet", () => paused = true);
  window.electron.ipcRenderer.on("resume-audio-worklet", () => paused = false);

  // Add the worklet module and connect it
  // @ts-ignore
  context.audioWorklet.addModule(new URL("../../workers/processor.js", import.meta.url).toString()).then(() => {
    captureNode = new AudioWorkletNode(context, "capture-processor");
    pre.connect(captureNode);
    hasWorkletStarted = true;
    captureNode.port.onmessage = event => {
      if (paused) return console.log("Dropping buffers due to transition"); // Drop data during transition
      if (amethyst.player.isPaused.value) return console.log("Dropping buffers due to player being paused"); 

      const float32 = event.data; // Float32Array
      const int16 = floatToInt16(float32);
      
      // Send to backend
      window.electron.ipcRenderer.invoke("audio-chunk", [
        JSON.parse(JSON.stringify(amethyst.state.realtimeDevices.value.find(device => device.name == amethyst.state.settings.audio.outputRealtimeDeviceName))),
        2, // channels
        amethyst.state.settings.audio.bufferSize,
        amethyst.player.context.sampleRate,
        int16.buffer,
      ]);
    };

  }).catch(e => console.log(e));
};

function connectToFinalNode(amethyst: Amethyst, context: AudioContext, pre: GainNode) {

  const device = (): RtAudioDeviceInfo => JSON.parse(JSON.stringify(amethyst.state.realtimeDevices.value.find(device => device.name == amethyst.state.settings.audio.outputRealtimeDeviceName)));
  const connectRealtimeDriver = () => {
    console.log(`Creating node for realtime device: ${amethyst.state.settings.audio.outputDeviceName}`);
    window.electron.ipcRenderer.invoke("start-realtime-audio-stream", [device(), 2, amethyst.state.settings.audio.bufferSize, amethyst.player.context.sampleRate]);

    // Watch for when the user changes the ASIO device
    watch(() => amethyst.state.settings.audio.outputRealtimeDeviceName, async newValue => {
      amethyst.state.settings.audio.outputDeviceName = newValue;
    });

    createRealtimeNode(context, pre);
  };

  if (amethyst.state.settings.audio.driver == "default") {
    pre.connect(context.destination);
  } else if (amethyst.state.settings.audio.driver == "asio" || amethyst.state.settings.audio.driver == "alsa" || amethyst.state.settings.audio.driver == "coreaudio") {
    connectRealtimeDriver();
  }

  watch(() => amethyst.state.settings.audio.driver, (newValue, oldValue) => {
    console.log(`Changed audio driver from ${oldValue} to ${newValue}`);
    amethyst.updateCurrentOutputDevice();

    switch (newValue) {
      case "default":
        pre.connect(context.destination);
        window.electron.ipcRenderer.invoke("close-realtime-audio-stream");
        return;
      case "coreaudio":
      case "alsa":
      case "asio":
        pre.disconnect(context.destination);
        if (hasWorkletStarted) {
          pre.connect(captureNode);
          window.electron.ipcRenderer.invoke("start-realtime-audio-stream", [device(), 2, amethyst.state.settings.audio.bufferSize, amethyst.player.context.sampleRate]);
        } else {
          connectRealtimeDriver();
        }
        return;
      default:
        break;
    }
  });

  console.log(`Using audio driver: ${amethyst.state.settings.audio.driver}`);
}

export class AmethystOutputNode extends AmethystAudioNode {
  public constructor(context: AudioContext, position: NodeProperties["position"], amethyst: Amethyst) {
    const pre = context.createGain();
    setTimeout(() => connectToFinalNode(amethyst, context, pre), 1000);
    super(pre, (null as any), "AmethystOutputNode", component, position, false, false, false);
    this.properties.icon = "ic:twotone-output";
  }

  public override getParameters() {
    return {};
  }
}
