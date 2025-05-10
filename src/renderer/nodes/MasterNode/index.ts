import { AmethystAudioNode } from "@/logic/audio.js";
import type { NodeProperties } from "@/logic/audioManager.js";
import component from "./component.vue";

export class AmethystMasterNode extends AmethystAudioNode {
  public constructor(context: AudioContext, position: NodeProperties["position"]) {
    const pre = context.createGain();
    const post = context.createGain();
    pre.connect(post);
    super(pre, post, "AmethystMasterNode", component, position, false, false, false);
    this.properties.icon = "ic:twotone-mediation";
  }

  public override getParameters() {
    return {};
  }
}
