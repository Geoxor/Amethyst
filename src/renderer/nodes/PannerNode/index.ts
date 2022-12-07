import { AmethystAudioNode, IAmethystNodeProperties } from "@/logic/audio";
import component from "./component.vue";

export class AmethystPannerNode extends AmethystAudioNode<StereoPannerNode> {
  public constructor(context: AudioContext, name: string, position: IAmethystNodeProperties["position"]) {
    const panner = context.createStereoPanner();
    panner.pan.value = 0;

    super(panner, name, component, position);
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
}
