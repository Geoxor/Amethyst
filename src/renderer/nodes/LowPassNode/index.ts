import { AmethystAudioNode, IAmethystNodeProperties } from "@/logic/audio";
import component from "./component.vue";

export class AmethystLowPassNode extends AmethystAudioNode<BiquadFilterNode> {
  public constructor(context: AudioContext, name: string, position: IAmethystNodeProperties["position"]) {
    const filter = context.createBiquadFilter();
    
    filter.type = "lowpass";
    filter.frequency.value = 22050;
    filter.Q.value = -3;

    super(filter, name, component, position);
  }

  public override reset(){
    this.audioNode.frequency.value = 22050;
    this.audioNode.gain.value = 0;
  }
}
