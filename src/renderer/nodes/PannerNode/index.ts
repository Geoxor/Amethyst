import type { NodeParameters, NumberNodeParameter } from "@/logic/audio";
import { AmethystAudioNode } from "@/logic/audio";
import type { NodeProperties } from "@/logic/audioManager";
import component from "./component.vue";

interface PannerNodeParameters extends NodeParameters {
  pan: NumberNodeParameter;
}

function clamp(input: number, min: number, max: number): number {
  return input < min ? min : input > max ? max : input;
}
function map(current: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
  const mapped: number = ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  return clamp(mapped, out_min, out_max);
}

export class AmethystPannerNode extends AmethystAudioNode {
  private panner: StereoPannerNode;

  public constructor(context: AudioContext, position: NodeProperties["position"]) {
    const pre = context.createGain();
    const post = context.createGain();
    super(pre, post, "AmethystPannerNode", component, position);
    this.properties.icon = "ic:twotone-fiber-smart-record";

    this.panner = context.createStereoPanner();
    this.panner.pan.value = 0;

    pre.connect(this.panner);
    this.panner.connect(post);
  }

  public override getParameters(): PannerNodeParameters {
    return {
      pan: {
        step: 0.25,
        default: 0,
        max: 180,
        type: "number",
        min: -180,
        current: this.pan,
        unit: "°"
      },
    };
  }

  public override applyParameters(parameters: PannerNodeParameters): void {
    this.pan = parameters.pan.current;
  }

  public get pan () {
    return map(this.panner.pan.value, -1, 1,-180, 180) ;
  }

  public set pan(value: number) {
    this.panner.pan.value = map(value, -180, 180, -1, 1,);
  }
 
  public getDisplayValue() {
    return this.pan.toFixed(2);
  }

  public override reset() {
    this.pan = this.getParameters().pan.default;
  }
}
