import { AmethystAudioNode } from "@/logic/audio";
import type { NodeProperties } from "@/logic/audioManager";
import component from "./component.vue";
import { amethyst, type Amethyst} from "@/amethyst";
import { watch } from "vue";
import { floatToInt16 } from "@/logic/math";
import type { RtAudioDeviceInfo } from "audify";

let hasWorkletStarted = false;
let captureNode: AudioWorkletNode;

let paused = false;

window.electron.ipcRenderer.on("pause-audio-worklet", () => paused = true);
window.electron.ipcRenderer.on("resume-audio-worklet", () => paused = false);

const createRealtimeNode = (context: AudioContext, pre: GainNode ) => {

  // Add the worklet module and connect it
  // @ts-ignore
  context.audioWorklet.addModule(new URL("../../workers/processor.js", import.meta.url).toString()).then(() => {
    captureNode = new AudioWorkletNode(context, "capture-processor");
    pre.connect(captureNode);
    hasWorkletStarted = true;
    captureNode.port.onmessage = event => {
      if (paused) return console.log("Dropping buffers due to transition"); // Drop data during transition

      const float32 = event.data; // Float32Array
      const int16 = floatToInt16(float32);
      
      // Send to backend
      window.electron.ipcRenderer.invoke("audio-chunk", [
        JSON.parse(JSON.stringify(amethyst.state.realtimeDevices.value.find(device => device.name == amethyst.state.settings.value.outputRealtimeAudioDeviceName))),
        2, // channels
        amethyst.state.settings.value.bufferSize,
        int16.buffer,
      ]);
    };

  }).catch(e => console.log(e));
};

function connectToFinalNode(amethyst: Amethyst, context: AudioContext, pre: GainNode) {

  const device = (): RtAudioDeviceInfo => JSON.parse(JSON.stringify(amethyst.state.realtimeDevices.value.find(device => device.name == amethyst.state.settings.value.outputRealtimeAudioDeviceName)));
  const connectRealtimeDriver = () => {
    console.log(`Creating node for realtime device: ${amethyst.state.settings.value.outputAudioDeviceName}`);
    window.electron.ipcRenderer.invoke("start-realtime-audio-stream", [device(), 2, amethyst.state.settings.value.bufferSize]);

    // Watch for when the user changes the ASIO device
    watch(() => amethyst.state.settings.value.outputRealtimeAudioDeviceName, async newValue => {
      amethyst.state.settings.value.outputAudioDeviceName = newValue;
    });

    createRealtimeNode(context, pre);
  };

  if (amethyst.state.settings.value.audioDriver == "default") {
    pre.connect(context.destination);
  } else if (amethyst.state.settings.value.audioDriver == "asio") {
    connectRealtimeDriver();
  }

  watch(() => amethyst.state.settings.value.audioDriver, newValue => {
    switch (newValue) {
      case "default":
        pre.connect(context.destination);
        pre.disconnect(captureNode);
        window.electron.ipcRenderer.invoke("close-realtime-audio-stream");
        amethyst.updateCurrentOutputDevice();
        return;
      case "asio":
        pre.disconnect(context.destination);
        if (hasWorkletStarted) {
          pre.connect(captureNode);
          window.electron.ipcRenderer.invoke("start-realtime-audio-stream", [device(), 2, amethyst.state.settings.value.bufferSize]);
        } else {
          connectRealtimeDriver();
        }
        return;
      default:
        break;
    }
  });

  console.log(`Using audio driver: ${amethyst.state.settings.value.audioDriver}`);
}

export class AmethystOutputNode extends AmethystAudioNode {
  public constructor(context: AudioContext, position: NodeProperties["position"], amethyst: Amethyst) {
    const pre = context.createGain();

    setTimeout(() => connectToFinalNode(amethyst, context, pre), 1000);

    super(pre, (null as any), "AmethystOutputNode", component, position, false, false, false);
  }

  public override getParameters() {
    return {};
  }
}
