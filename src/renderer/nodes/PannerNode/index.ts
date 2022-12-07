import { AmethystAudioNode } from "@/logic/audio";
import { NodeProperties, Paramaters } from "@/logic/audioManager";
import component from "./component.vue";

export class AmethystPannerNode extends AmethystAudioNode<StereoPannerNode> {
  public constructor(context: AudioContext, position: NodeProperties["position"]) {
    const panner = context.createStereoPanner();
    panner.pan.value = 0;

    super(panner, "AmethystPannerNode", component, position);
  }

  public get pan () {
    return this.audioNode.pan.value;
  }

  public set pan(pan: number) {
    this.audioNode.pan.value = pan;
  }

  public override reset() {
    this.pan = 0;
  }

  public getParameters(): Paramaters {
    return {
      pan: this.pan,
    };
  }
}
