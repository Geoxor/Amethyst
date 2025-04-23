import { AmethystAudioNode } from "@/logic/audio";
import type { NodeProperties } from "@/logic/audioManager";
import { ref } from "vue";
import component from "./component.vue";
import { logValueToPercentage } from "@/logic/math";

interface Parameters {
  frequency: number,
  gain: number;
  Q: number;
  type: BiquadFilterType;
}

export class AmethystFilterNode extends AmethystAudioNode {
  // Used to remember the state for onMounted state 
  // for the slider
  // The typecasting is a small hack because this is passed into a reactive object as markRaw()
  public frequencyPercent = ref(35) as unknown as number;
  public MIN_FREQUENCY = 20;
  public MAX_FREQUENCY = 22050;
  private filter: BiquadFilterNode;

  public constructor(context: AudioContext, position: NodeProperties["position"]) {
    const pre = context.createGain();
    const post = context.createGain();
    super(pre, post, "AmethystFilterNode", component, position);
    
    this.filter = context.createBiquadFilter();
    pre.connect(this.filter);
    this.filter.connect(post);

      this.type = "lowpass";
      this.frequency = 200;
      this.frequencyPercent = logValueToPercentage(this.frequency, this.MIN_FREQUENCY, this.MAX_FREQUENCY);
      this.Q = 1;
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
    this.frequency = 200;
    this.frequencyPercent = logValueToPercentage(this.frequency, this.MIN_FREQUENCY, this.MAX_FREQUENCY);
    this.gain = 0;
    this.Q = 1;
    this.type = "lowpass";
  }

  public override getParameters() {
    return {
      frequency: this.frequency,
      gain: this.gain,
      Q: this.Q,
      type: this.type,
    };
  }

  public override applyParameters(parameters: Parameters): void {
    this.frequency = parameters.frequency;
    this.frequencyPercent = logValueToPercentage(this.frequency, this.MIN_FREQUENCY, this.MAX_FREQUENCY);
    this.gain = parameters.gain;
    this.Q = parameters.Q;
    this.type = parameters.type;
  }
}
