import type { NodeParameter } from "@/logic/audio";
import { AmethystAudioNode } from "@/logic/audio";
import type { NodeProperties } from "@/logic/audioManager";
import component from "./component.vue";

interface GainNodeParameters {
  gain: NodeParameter<number>;
}

export class AmethystGainNode extends AmethystAudioNode {
  private gainNode: GainNode;

  public constructor(context: AudioContext, position: NodeProperties["position"]) {
    const pre = context.createGain();
    const post = context.createGain();
    super(pre, post, "AmethystGainNode", component, position);
    this.properties.icon = "ic:twotone-volume-up";
    
    this.gainNode = context.createGain();;
    pre.connect(this.gainNode);
    this.gainNode.connect(post);
  }

  public override getParameters(): GainNodeParameters {
    return {
      gain: {
        default: 1.0,
        max: 2.0,
        min: 0.0,
        current: this.gain,
        unit: "dB"
      },
    };
  }

  public override applyParameters(parameters: GainNodeParameters): void {
    this.gain = parameters.gain.current;
  }

  public get gain () {
    return this.gainNode.gain.value;
  }

  public set gain(gain: number) {
    this.gainNode.gain.value = gain;
  }

  public override reset() {
    this.gain = this.getParameters().gain.default;
  }
}
