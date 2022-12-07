import { AmethystAudioNode } from "@/logic/audio";
import { NodeProperties } from "@/logic/audioManager";
import component from "./component.vue";

export class AmethystMasterNode extends AmethystAudioNode<GainNode> {
  public constructor(node: GainNode, position: NodeProperties["position"]) {
    super(node, "AmethystMasterNode", component, position, false);
  }
}
