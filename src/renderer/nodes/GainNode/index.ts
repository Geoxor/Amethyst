import { AmethystAudioNode } from "@/logic/audio";
import { NodeProperties } from "@/logic/audioManager";
import component from "./component.vue";

interface Parameters {
  gain: number;
}

export class AmethystGainNode extends AmethystAudioNode {
  private gainNode: GainNode;

  public constructor(context: AudioContext, position: NodeProperties["position"]) {
    const pre = context.createGain();
    const post = context.createGain();
    super(pre, post, "AmethystGainNode", component, position);
    
    this.gainNode = context.createGain();;
    pre.connect(this.gainNode);
    this.gainNode.connect(post);
  }

  public get gain () {
    return this.gainNode.gain.value;
  }

  public set gain(gain: number) {
    this.gainNode.gain.value = gain;
  }

  public override reset() {
    this.gain = 1.0;
  }

  public override getParameters() {
    return {
      gain: this.gain,
    };
  }

  public override applyParameters(parameters: Parameters): void {
    this.gain = parameters.gain;
  }
}
