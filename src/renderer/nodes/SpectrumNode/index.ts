import type { NodeParameters } from "@/logic/audio.js";
import { AmethystAudioNode } from "@/logic/audio.js";
import type { NodeProperties } from "@/logic/audioManager.js";

import component from "./component.vue";

export class AmethystSpectrumNode extends AmethystAudioNode {
  public constructor(context: AudioContext, position: NodeProperties["position"]) {
    const pre = context.createGain();
    const post = context.createGain();
    pre.connect(post);
    super(pre, post, "AmethystSpectrumNode", component, position);
    this.properties.icon = "ic:twotone-graphic-eq";
  }

  public getParameters(): NodeParameters {
    return {};
  };
}
