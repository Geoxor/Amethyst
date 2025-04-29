import { AmethystAudioNode } from "@/logic/audio";
import type { NodeProperties } from "@/logic/audioManager";
import component from "./component.vue";
import { amethyst, type Amethyst} from "@/amethyst";
import { watch } from "vue";
import { floatToInt16 } from "@/logic/math";
import type { RtAudioDeviceInfo } from "audify";

const createRealtimeNode = (context: AudioContext, pre: GainNode ) => {
  // Add the worklet module and connect it
  context.audioWorklet.addModule(new URL("../../workers/processor.js", import.meta.url).toString()).then(() => {
    const captureNode = new AudioWorkletNode(context, "capture-processor");
    pre.connect(captureNode); // tap before destination

    captureNode.port.onmessage = event => {
      const float32 = event.data; // Float32Array
      const int16 = floatToInt16(float32);
      
      // Send to backend
      window.electron.ipcRenderer.invoke("audio-chunk", [
        JSON.parse(JSON.stringify(amethyst.state.realtimeDevices.value.find(device => device.name == amethyst.state.settings.value.outputAudioDeviceName))),
        2, // channels
        amethyst.state.settings.value.bufferSize,
        int16.buffer,
      ]);
    };

  }).catch(e => console.log(e));
};

function connectToFinalNode(amethyst: Amethyst, context: AudioContext, pre: GainNode) {
  if (amethyst.state.settings.value.audioDriver == "default") {
    pre.connect(context.destination);
  } else if (amethyst.state.settings.value.audioDriver == "asio") {
    console.log(`looking for device ${amethyst.state.settings.value.outputAudioDeviceName}`);
    // const device = amethyst.state.realtimeDevices.value.find(device => device.name == amethyst.state.settings.value.outputAudioDeviceName);
    // if (!device) return console.error(`that realtime device doesn't exist ${device}`);
    createRealtimeNode(context, pre);
  }

  console.log(`Using audio driver: ${amethyst.state.settings.value.audioDriver}`);
}

export class AmethystOutputNode extends AmethystAudioNode {
  public constructor(context: AudioContext, position: NodeProperties["position"], amethyst: Amethyst) {
    const pre = context.createGain();
    
    setTimeout(() => connectToFinalNode(amethyst, context, pre), 1000);

    watch(() => amethyst.state.settings.value.audioDriver, newValue => {
			if (newValue !== "asio") {
        window.electron.ipcRenderer.invoke("close-realtime-audio-stream");
      }
      connectToFinalNode(amethyst, context, pre);
    });

    super(pre, (null as any), "AmethystOutputNode", component, position, false, false, false);
  }

  public override getParameters() {
    return {};
  }
}
