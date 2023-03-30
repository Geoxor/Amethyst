import { AmethystAudioNode } from "@/logic/audio";
import { NodeProperties } from "@/logic/audioManager";
import component from "./component.vue";

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
    this.gainNode.gain.value = 1.0;
  }
}
