import { AmethystAudioNode } from "@/logic/audio";
import type { NodeProperties } from "@/logic/audioManager";
import component from "./component.vue";

interface Parameters {
  pan: number,
}

export class AmethystPannerNode extends AmethystAudioNode {
  public panner: StereoPannerNode;

  public constructor(context: AudioContext, position: NodeProperties["position"]) {
    const pre = context.createGain();
    const post = context.createGain();
    super(pre, post, "AmethystPannerNode", component, position);

    this.panner = context.createStereoPanner();
    this.panner.pan.value = 0;

    pre.connect(this.panner);
    this.panner.connect(post);
  }

  public get pan () {
    return this.panner.pan.value;
  }

  public set pan(pan: number) {
    this.panner.pan.value = pan;
  }

  public override reset() {
    this.pan = 0;
  }

  public override getParameters() {
    return {
      pan: this.pan,
    };
  }

  public override applyParameters(parameters: Parameters): void {
    this.pan = parameters.pan;
  }
}
