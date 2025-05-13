import type { NodeParameters, NumberNodeParameter } from "@/logic/audio";
import { AmethystAudioNode } from "@/logic/audio";
import type { NodeProperties } from "@/logic/audioManager";
import { map } from "@/logic/math";

import component from "./component.vue";

interface PannerNodeParameters extends NodeParameters {
  pan: NumberNodeParameter;
}

export class AmethystPannerNode extends AmethystAudioNode {
  private panner: StereoPannerNode;

  public constructor(context: AudioContext, position: NodeProperties["position"]) {
    const pre = context.createGain();
    const post = context.createGain();
    super(pre, post, "AmethystPannerNode", component, position);
    this.properties.icon = "ic:twotone-fiber-smart-record";

    this.panner = context.createStereoPanner();
    pre.connect(this.panner);
    this.panner.connect(post);

    this.reset();
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
