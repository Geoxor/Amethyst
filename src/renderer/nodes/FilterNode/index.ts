import { AmethystAudioNode } from "@/logic/audio";
import { NodeProperties } from "@/logic/audioManager";
import { player } from "@/logic/player";
import { ref } from "vue";
import component from "./component.vue";

export class AmethystFilterNode extends AmethystAudioNode<BiquadFilterNode> {
  // Used to remember the state for onMounted state 
  // for the slider
  // The typecasting is a small hack because this is passed into a reactive object as markRaw()
  public frequencyPercent = ref(100) as unknown as number;
  public MIN_FREQUENCY = 20;
  public MAX_FREQUENCY = player.nodeManager.context.sampleRate / 2;

  public constructor(context: AudioContext, position: NodeProperties["position"]) {
    const filter = context.createBiquadFilter();
    super(filter, "AmethystFilterNode", component, position);
    
    filter.type = "lowpass";
    filter.frequency.value = this.MAX_FREQUENCY;
    filter.Q.value = -3;
  }

  public get type () {
    return this.audioNode.type;
  }

  public set type(type: BiquadFilterType) {
    this.audioNode.type = type;
  }

  public get frequency() {
    return this.audioNode.frequency.value;
  }

  public get Q() {
    return this.audioNode.Q.value;
  }

  public get gain() {
    return this.audioNode.gain.value;
  }

  public set frequency(freq: number) {
    this.audioNode.frequency.value = freq;
  }

  public set Q(q: number) {
    this.audioNode.Q.value = q;
  }

  public set gain(gain: number) {
    this.audioNode.gain.value = gain;
  }

  public override reset(){
    this.frequencyPercent = 100;
    this.gain = 0;
    this.Q = -3;
    this.type = "lowpass";
  }

  public getParameters() {
    return {
      frequencyPercent: this.frequencyPercent,
      frequency: this.frequency,
      gain: this.gain,
      Q: this.Q,
      type: this.type,
    };
  }
}
