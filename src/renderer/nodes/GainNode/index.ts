import { AmethystAudioNode } from "@/logic/audio";
import { NodeProperties } from "@/logic/audioManager";
import component from "./component.vue";

export class AmethystGainNode extends AmethystAudioNode<GainNode> {
  public constructor(context: AudioContext, position: NodeProperties["position"]) {
    super(context.createGain(), "AmethystGainNode", component, position);
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

  public getParameters() {
    return {
      gain: this.gain,
    };
  }
}
