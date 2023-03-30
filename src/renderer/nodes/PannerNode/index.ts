import { AmethystAudioNode } from "@/logic/audio";
import { NodeProperties } from "@/logic/audioManager";
import component from "./component.vue";

export class AmethystPannerNode extends AmethystAudioNode {
  public panner: StereoPannerNode;

  public constructor(context: AudioContext, position: NodeProperties["position"]) {
    const pre = context.createGain();
    const post = context.createGain();
    super(pre, post, "AmethystPannerNode", component, position);

    this.panner = context.createStereoPanner();
    this.panner.pan.value = 0;

    pre.connect(this.panner);
    this.panner.connect(post);
  }

  public get pan () {
    return this.panner.pan.value;
  }

  public set pan(pan: number) {
    this.panner.pan.value = pan;
  }

  public override reset() {
    this.pan = 0;
  }

}
