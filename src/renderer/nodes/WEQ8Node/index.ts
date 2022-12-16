import { AmethystAudioNode } from "@/logic/audio";
import { Node, NodeProperties } from "@/logic/audioManager";
import { player } from "@/logic/player";
import { v4 as uuid } from "uuid";
import { WEQ8Runtime } from "weq8"; // or from "https://cdn.skypack.dev/weq8"
import { FilterType, WEQ8Spec } from "weq8/dist/spec";
import component from "./component.vue";

export let weq8: WEQ8Runtime;

export class WEQ8Node extends AmethystAudioNode<AudioNode> {
  public constructor(context: AudioContext, position: NodeProperties["position"]) {
    weq8 = new WEQ8Runtime(context);

    super(weq8.input, "WEQ8Node", component, position);
  }

  protected override connectAudioNode(target: AudioNode) {
    const parent = player.nodeManager.nodes.value.find(node => node.connections.some(connection => connection.target === this.properties.id))?.audioNode;
    parent?.connect(this.audioNode);
    weq8.connect(target);
  }

  public override loadPropertiesFromJSON(json: Node) {

    // overwrite the id to the .ang file
    this.properties.id = json.id;
    // @ts-ignore Set the parameters 
    json.paramaters.forEach((spec, i) => {
      weq8.setFilterFrequency(i, spec.frequency);
      weq8.setFilterGain(i, spec.gain);
      weq8.setFilterQ(i, spec.Q);
      weq8.setFilterType(i, spec.type as ("noop" | FilterType));
    });
    // edge line connections
    this.connections = json.connections;
  }

  public override reset() {
    [
      { type: "lowshelf24", frequency: 30, gain: 0, Q: 0.7, bypass: false },
      { type: "peaking12", frequency: 200, gain: 0, Q: 0.7, bypass: false },
      { type: "peaking12", frequency: 1000, gain: 0, Q: 0.7, bypass: false },
      { type: "highshelf12", frequency: 5000, gain: 0, Q: 0.7, bypass: false },
      { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
      { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
      { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
      { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    ].forEach((spec, i) => {
      weq8.setFilterFrequency(i, spec.frequency);
      weq8.setFilterGain(i, spec.gain);
      weq8.setFilterQ(i, spec.Q);
      weq8.setFilterType(i, spec.type as ("noop" | FilterType));
    });
  }

  public getParameters(): WEQ8Spec {
    return weq8.spec;
  }
}
