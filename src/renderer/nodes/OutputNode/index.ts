import { AmethystAudioNode } from "@/logic/audio";
import type { NodeProperties } from "@/logic/audioManager";
import component from "./component.vue";

export class AmethystOutputNode extends AmethystAudioNode {
  public constructor(context: AudioContext, position: NodeProperties["position"]) {
    const pre = context.createGain();
    const post = context.destination;
    pre.connect(post);
    super(pre, (post as any), "AmethystOutputNode", component, position, false, false, false);
    this.properties.icon = "ic:twotone-output";
  }

  public override getParameters() {
    return {};
  }
}