import AnalyzerNode from "@/components/nodes/AnalyzerNode.vue";
import FilterNode from "@/components/nodes/FilterNode.vue";
import GainNode from "@/components/nodes/GainNode.vue";
import InputNode from "@/components/nodes/InputNode.vue";
import MasterNode from "@/components/nodes/MasterNode.vue";
import OutputNode from "@/components/nodes/OutputNode.vue";
import PannerNode from "@/components/nodes/PannerNode.vue";
import { Position } from "@vue-flow/core";
import { v4 as uuid } from "uuid";
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
};

export class AmethystAudioNodeManager {
  private input: AmethystAudioNode<AudioNode>;
  private output: AmethystAudioNode<AudioNode>;
  
  public master: AmethystAudioNode<GainNode>;
  
  public nodes: AmethystAudioNode<AudioNode>[] = ref([]).value;

  public constructor(input: AudioNode, public context: AudioContext) {
    this.input = new AmethystAudioNode(input, "input", InputNode, { x: 0, y: 0 }, false);
    this.master = new AmethystAudioNode(this.context.createGain(), "master", MasterNode, { x: 300, y: 0 }, false);
    this.output = new AmethystAudioNode(this.context.destination, "output", OutputNode, { x: 450, y: 0 }, false);

    this.input.connectTo(this.master);
    this.master.connectTo(this.output);

    this.nodes.push(this.input);
    this.nodes.push(this.master);
    this.nodes.push(this.output);
  }

  public removeNode(node: AmethystAudioNode<AudioNode>) {
    if (!node.isRemovable) return;
    node.disconnect();
    this.nodes.splice(this.nodes.findIndex(n => n.properties.id === node.properties.id), 1);
  }

  public addNode(node: AmethystAudioNode<AudioNode>, betweenNodes?: [AmethystAudioNode<AudioNode>, AmethystAudioNode<AudioNode>]) {
    // If the user right clicked a connection line, add the node inbetween the 2 nodes that were connected
    if (betweenNodes) {
      const [source, target] = betweenNodes;
      source.disconnectFrom(target);
      source.connectTo(node);
      node.connectTo(target);
    }
    
    this.nodes.push(node);
  }

  public getNodeProperties() {
    return this.nodes.map(node => node.properties);
  }

  public getNodeComponents() {
    return this.nodes.map(node => node.component);
  }

  public getNodeConnections() {
    const allConnections: IAmethystNodeConnection[] = [];

    this.nodes.forEach(node => {
      node.connections.forEach(connection => allConnections.push(connection));
    });

    return allConnections;
  }

  public getNodeConnectinsString() {
    return this.getNodeConnections().toString();
  }
}

export class AmethystAudioNode<T extends AudioNode> {
  public properties: IAmethystNodeProperties;
  public connections: IAmethystNodeConnection[] = [];
  public isDisabled: boolean = false;
  private connectedTo: (AmethystAudioNode<AudioNode>)[] = [];
  public component: DefineComponent<{}, {}, any>;

  public constructor(public node: T, name: string, component: DefineComponent<{}, {}, any>, position: IAmethystNodeProperties["position"], public isRemovable: boolean = true) {
    const id = `${name}-${uuid()}`;
    
    this.properties = {
      id,
      type: `custom-${id}`,
      position,
      sourcePosition: Position.Right,
    };
    this.component = markRaw(component);
  }

  public getSlotName() {
    return `node-${this.properties.type}`;
  }

  public connectTo(target: AmethystAudioNode<AudioNode>) {
    this.connectedTo.push(target);
    this.connections.push({ 
      id: `edge-${this.properties.id}-${target.properties.id}`, 
      source: this.properties.id, 
      target: target.properties.id 
    });
    this.node.connect(target.node);
  }

  public disconnectFrom(target: AmethystAudioNode<AudioNode>) {
    delete this.connectedTo[this.connectedTo.indexOf(target)];
    delete this.connections[this.connections.findIndex(connection => connection.id === `edge-${this.properties.id}-${target.properties.id}`)];
    this.node.disconnect(target.node);
  }

  public disconnect() {
    this.node.disconnect();
    this.connections = [];
    this.connectedTo = [];
  }

  public updatePosition(newPosition: {x: number, y: number}) {
    this.properties.position = newPosition;
  }

  public reset(){
    console.log(new Error("Not implemented"));
  };
}

export class AmethystLowPassNode extends AmethystAudioNode<BiquadFilterNode> {
  public constructor(context: AudioContext, name: string, position: IAmethystNodeProperties["position"]) {
    const filter = context.createBiquadFilter();
    
    filter.type = "lowpass";
    filter.frequency.value = 22050;
    filter.Q.value = -3;
    filter.gain.value = 0;

    super(filter, name, FilterNode, position);
  }

  public override reset(){
    this.node.frequency.value = 100;
    this.node.gain.value = 0;
  }
}

export class AmethystSpectrumNode extends AmethystAudioNode<AudioNode> {
  public constructor(context: AudioContext, name: string, position: IAmethystNodeProperties["position"]) {
    super(context.createGain(), name, AnalyzerNode, position);
  }

  public reset(){};
}

export class AmethystPannerNode extends AmethystAudioNode<StereoPannerNode> {
  public constructor(context: AudioContext, name: string, position: IAmethystNodeProperties["position"]) {
    const panner = context.createStereoPanner();
    panner.pan.value = 0;

    super(panner, name, PannerNode, position);
  }

  public override reset() {
    this.node.pan.value = 0;
  }
}

export class AmethystGainNode extends AmethystAudioNode<GainNode> {
  public constructor(context: AudioContext, name: string, position: IAmethystNodeProperties["position"]) {
    super(context.createGain(), name, GainNode, position);
  }

  public override reset() {
    this.node.gain.value = 1;
  }
}
