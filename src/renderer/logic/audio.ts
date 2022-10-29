import AnalyzerNode from "@/components/nodes/AnalyzerNode.vue";
import FilterNode from "@/components/nodes/FilterNode.vue";
import GainNode from "@/components/nodes/GainNode.vue";
import InputNode from "@/components/nodes/InputNode.vue";
import MasterNode from "@/components/nodes/MasterNode.vue";
import OutputNode from "@/components/nodes/OutputNode.vue";
import PannerNode from "@/components/nodes/PannerNode.vue";
import { Position } from "@vue-flow/core";
import { DefineComponent, markRaw, ref } from "vue";

export interface IAmethystNodeProperties {
  id: string,
  type: `custom-${string}`,
  position: { x: number, y: number },
  sourcePosition: Position,
};

export interface IAmethystNodeConnection {
  id: `${string}-${string}`,
  source: string,
  target: string,
  animated: true,
};

export class AmethystAudioNodeManager {
  private input: AmethystAudioNode<AudioNode>;
  private output: AmethystAudioNode<AudioNode>;
  
  public master: AmethystAudioNode<AudioNode>;
  
  public nodes: AmethystAudioNode<AudioNode>[] = ref([]).value;

  public constructor(input: AudioNode, public context: AudioContext) {
    this.input = new AmethystAudioNode(input, "input", InputNode, { x: -50, y: 0 }, false);
    this.master = new AmethystAudioNode(this.context.createGain(), "master", MasterNode, { x: 925, y: 0 }, false);
    this.output = new AmethystAudioNode(this.context.destination, "output", OutputNode, { x: 1050, y: 0 }, false);

    // Attach first audio source node
    this.nodes.push(this.input);

    // All effect nodes
    this.nodes.push(new AmethystEqualizerNode(this.context, "filter", { x: 100, y: 0 }));
    this.nodes.push(new AmethystPannerNode(this.context, "panner", { x: 300, y: 0 }));
    this.nodes.push(new AmethystGainNode(this.context, "gain", { x: 500, y: 0 }));
    this.nodes.push(new AmethystSpectrumNode(this.context, "spectrum", { x: 700, y: 0 }));

    // Attach master node
    this.nodes.push(this.master);

    // Attach last output node
    this.nodes.push(this.output);
    this.connectNodes();
  }

  private connectNodes() {
    const enabledNodes = this.nodes.filter(n => !n.isDisabled);

    for (let i = enabledNodes.length - 1; i >= 0; i--) {
      const previousNode = enabledNodes[i - 1];
      const node = enabledNodes[i];

      previousNode && previousNode.connectTo(node);
    }
  }

  private reconnectNodes() {
    this.nodes.forEach(node => node.disconnect());
    this.connectNodes();
  }

  public removeNode(id: string) {
    const target = this.nodes[this.nodes.findIndex(node => node.properties.id === id)];
    if (!target.isRemovable) return;
    target.disconnect();
    delete this.nodes[this.nodes.findIndex(node => node.properties.id === id)];
    this.nodes = this.nodes.filter(n => !!n);
    this.connectNodes();
  }

  public addNode<T extends AudioNode>(node: AmethystAudioNode<T>) {
    this.nodes.splice(this.nodes.length - 2, 0, node);
    this.connectNodes();
  }

  public disableNode<T extends AudioNode>(node: AmethystAudioNode<T>) {
    node.isDisabled = true;
    this.reconnectNodes();
  }

  public enableNode<T extends AudioNode>(node: AmethystAudioNode<T>) {
    node.isDisabled = false;
    this.reconnectNodes();
  }

  public getNodeProperties() {
    return this.nodes.map(node => node.properties);
  }

  public getNodeComponents() {
    return this.nodes.map(node => node.component);
  }

  public getNodeConnections() {
    return this.nodes.map(node => node.connection).filter(n => !!n) as IAmethystNodeConnection[];
  }
}

export class AmethystAudioNode<T extends AudioNode> {
  public properties: IAmethystNodeProperties;
  public connection: IAmethystNodeConnection | undefined;
  public isDisabled: boolean = false;
  private connectedTo: AmethystAudioNode<T> | undefined;
  public component: DefineComponent<{}, {}, any>;

  public constructor(public node: T, name: string, component: DefineComponent<{}, {}, any>, position: IAmethystNodeProperties["position"], public isRemovable: boolean = true) {
    this.properties = {
      id: name,
      type: `custom-${name}`,
      position,
      sourcePosition: Position.Right,
    };
    this.component = markRaw(component);
  }

  public getSlotName() {
    return `node-${this.properties.type}`;
  }

  public connectTo(target: AmethystAudioNode<T>) {
    this.connectedTo = target;
    this.connection = { id: `edge-${this.properties.id}-${target.properties.id}`, source: this.properties.id, target: target.properties.id, animated: true };
    this.node.connect(target.node);
  }

  public disconnect() {
    this.node.disconnect();
    delete this.connection;
  }
}

export class AmethystEqualizerNode extends AmethystAudioNode<BiquadFilterNode> {
  public constructor(context: AudioContext, name: string, position: IAmethystNodeProperties["position"]) {
    const filter = context.createBiquadFilter();
    filter.type = "lowshelf";
    filter.frequency.value = 100;
    filter.gain.value = 0;

    super(filter, name, FilterNode, position);
  }
}

export class AmethystSpectrumNode extends AmethystAudioNode<AudioNode> {
  public constructor(context: AudioContext, name: string, position: IAmethystNodeProperties["position"]) {
    super(context.createGain(), name, AnalyzerNode, position);
  }
}

export class AmethystPannerNode extends AmethystAudioNode<StereoPannerNode> {
  public constructor(context: AudioContext, name: string, position: IAmethystNodeProperties["position"]) {
    const panner = context.createStereoPanner();
    panner.pan.value = 0;

    super(panner, name, PannerNode, position);
  }
}

export class AmethystGainNode extends AmethystAudioNode<GainNode> {
  public constructor(context: AudioContext, name: string, position: IAmethystNodeProperties["position"]) {
    super(context.createGain(), name, GainNode, position);
  }
}
