import { AmethystAudioNode } from "@/logic/audio";
import { NodeProperties } from "@/logic/audioManager";
import { ref } from "vue";
import component from "./component.vue";

export class AmethystFilterNode extends AmethystAudioNode {
  // Used to remember the state for onMounted state 
  // for the slider
  // The typecasting is a small hack because this is passed into a reactive object as markRaw()
  public frequencyPercent = ref(35) as unknown as number;
  public MIN_FREQUENCY = 20;
  public MAX_FREQUENCY = 22050;
  public filter: BiquadFilterNode;

  public constructor(context: AudioContext, position: NodeProperties["position"]) {
    const pre = context.createGain();
    const post = context.createGain();
    super(pre, post, "AmethystFilterNode", component, position);
    
    this.filter = context.createBiquadFilter();
    pre.connect(this.filter);
    this.filter.connect(post);
    this.filter.type = "lowpass";
    this.filter.frequency.value = 233;
    this.filter.Q.value = 1;
  }

  public get type (): BiquadFilterType {
    return this.filter.type;
  }

  public set type(type: BiquadFilterType) {
    this.filter.type = type;
  }

  public get frequency() {
    return this.filter.frequency.value;
  }

  public set frequency(freq: number) {
    this.filter.frequency.value = freq;
  }
  
  public get Q() {
    return this.filter.Q.value;
  }

  public get gain() {
    return this.filter.gain.value;
  }

  public set Q(q: number) {
    this.filter.Q.value = q;
  }

  public set gain(gain: number) {
    this.filter.gain.value = gain;
  }

  public override reset(){
    this.frequencyPercent = 35;
    this.filter.gain.value = 0;
    this.filter.Q.value = 1;
    this.filter.type = "lowpass";
  }

}
