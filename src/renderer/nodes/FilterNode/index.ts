import type { NodeParameters, NumberNodeParameter, StringNodeParameter } from "@/logic/audio";
import { AmethystAudioNode } from "@/logic/audio";
import type { NodeProperties } from "@/logic/audioManager";
import { ref } from "vue";
import component from "./component.vue";
import { logValueToPercentage } from "@/logic/math";

interface FilterNodeParameters extends NodeParameters {
  frequency: NumberNodeParameter,
  gain: NumberNodeParameter;
  q: NumberNodeParameter;
  type: StringNodeParameter<BiquadFilterType>;
} 

const FILTER_TYPES: BiquadFilterType[] = [
  // "allpass",
  "lowshelf",
  "lowpass",
  "bandpass",
  // "notch",
  "peaking",
  "highpass",
  "highshelf",
] ;

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
    this.properties.icon = "ic:twotone-filter-list";

    this.filter = context.createBiquadFilter();
    pre.connect(this.filter);
    this.filter.connect(post);

    this.reset();
  }

  public override getParameters(): FilterNodeParameters {
    return {
      frequency: {
        current: this.frequency,
        type: "number",
        default: 100,
        max: 22050,
        min: 20,
        step: 0.1,
        unit: "Hz"
      },
      gain: {
        current: this.gain,
        type: "number",
        default: 0,
        max: 32,
        min: -32,
        step: 0.1,
        unit: "dB"
      },
      q: {
        current: this.q,
        type: "number",
        default: 1,
        max: 3,
        min: 0.1,
        step: 0.1,
        unit: "q"
      },
      type: {
        current: this.type,
        type: "string",
        default: "peaking",
        options: FILTER_TYPES
      },
    };
  }

  public override applyParameters(parameters: FilterNodeParameters): void {
    this.frequency = parameters.frequency.current;
    this.frequencyPercent = logValueToPercentage(this.frequency, this.MIN_FREQUENCY, this.MAX_FREQUENCY);
    this.gain = parameters.gain.current;
    this.q = parameters.q.current;
    this.type = parameters.type.current ;
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
  
  public get q() {
    return this.filter.Q.value;
  }

  public get gain() {
    return this.filter.gain.value;
  }

  public set q(q: number) {
    this.filter.Q.value = q;
  }

  public set gain(gain: number) {
    this.filter.gain.value = gain;
  }

  public override reset(){
    this.frequency = this.getParameters().frequency.default;
    this.gain = this.getParameters().gain.default;
    this.q = this.getParameters().q.default;
    this.type = this.getParameters().type.default;
  }
}
