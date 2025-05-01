import { AmethystAudioNode } from "@/logic/audio";
import type { NodeProperties } from "@/logic/audioManager";
import component from "./component.vue";

export class AmethystInputNode extends AmethystAudioNode {
  public constructor(node: AudioNode, position: NodeProperties["position"]) {
    const pre = node.context.createGain();
    const post = node.context.createGain();
    node.connect(pre);
    pre.connect(post);
    super(pre, post, "AmethystInputNode", component, position, false, false, false);
    this.properties.icon = "ic:twotone-input";
  }

  public override getParameters() {
    return {};
  }
}
