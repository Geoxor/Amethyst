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
        default: 0,
        max: 16,
        min: -128,
        step: 0.1,
        current: this.gain,
        unit: "dB"
      },
    };
  }

  public override applyParameters(parameters: GainNodeParameters): void {
    this.gain = parameters.gain.current;
  }

  public get gain () {
    return 20 * Math.log10( this.gainNode.gain.value);
  }

  public set gain(dB: number) {
    this.gainNode.gain.value = Math.pow(10, dB / 20);
  }

  public getDisplayValue() {
    return this.gain.toFixed(2);
  }

  public override reset() {
    this.gain = this.getParameters().gain.default;
  }
}
