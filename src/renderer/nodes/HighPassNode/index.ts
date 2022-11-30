import { AmethystAudioNode, IAmethystNodeProperties } from "@/logic/audio";
import component from "./component.vue";

export class AmethystHighPassNode extends AmethystAudioNode<BiquadFilterNode> {
  public constructor(context: AudioContext, name: string, position: IAmethystNodeProperties["position"]) {
    const filter = context.createBiquadFilter().context.createBiquadFilter().context.createBiquadFilter().context.createBiquadFilter();
    
    filter.type = "highpass";
    filter.frequency.value = 20;
    filter.Q.value = -3;

    super(filter, name, component, position);
  }

  public override reset(){
    this.audioNode.frequency.value = 20;
  }
}
