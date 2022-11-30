import { AmethystAudioNode, IAmethystNodeProperties } from "@/logic/audio";
import component from "./component.vue";

export class AmethystPannerNode extends AmethystAudioNode<StereoPannerNode> {
  public constructor(context: AudioContext, name: string, position: IAmethystNodeProperties["position"]) {
    const panner = context.createStereoPanner();
    panner.pan.value = 0;

    super(panner, name, component, position);
  }

  public override reset() {
    this.audioNode.pan.value = 0;
  }
}
