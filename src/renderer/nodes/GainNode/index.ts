import { AmethystAudioNode, IAmethystNodeProperties } from "@/logic/audio";
import component from "./component.vue";

export class AmethystGainNode extends AmethystAudioNode<GainNode> {
  public constructor(context: AudioContext, name: string, position: IAmethystNodeProperties["position"]) {
    super(context.createGain(), name, component, position);
  }

  public override reset() {
    this.audioNode.gain.value = 1;
  }
}
