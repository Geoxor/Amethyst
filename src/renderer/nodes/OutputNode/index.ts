import { AmethystAudioNode } from "@/logic/audio";
import { NodeProperties } from "@/logic/audioManager";
import component from "./component.vue";

export class AmethystOutputNode extends AmethystAudioNode<AudioNode> {
  public constructor(node: AudioNode, position: NodeProperties["position"]) {
    super(node, "AmethystOutputNode", component, position, false);
  }
}
