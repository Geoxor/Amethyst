import { AmethystAudioNode, IAmethystNodeProperties } from "@/logic/audio";
import component from "./component.vue";

export class AmethystGainNode extends AmethystAudioNode<GainNode> {
  public constructor(context: AudioContext, name: string, position: IAmethystNodeProperties["position"]) {
    super(context.createGain(), name, component, position);
  }

  public get gain () {
    return this.audioNode.gain.value;
  }

  public set gain(gain: number) {
    this.audioNode.gain.value = gain;
  }

  public override reset() {
    this.gain = 1;
  }
}
