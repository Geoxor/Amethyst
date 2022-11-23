import { usePlayer } from "@/amethyst";
import AnalyzerNode from "@/components/nodes/AnalyzerNode.vue";
import GainNode from "@/components/nodes/GainNode.vue";
import HighpassFilterNode from "@/components/nodes/HighpassFilterNode.vue";
import InputNode from "@/components/nodes/InputNode.vue";
import LowpassFilterNode from "@/components/nodes/LowpassFilterNode.vue";
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

      // Align the new node between the source and target
      node.properties.position.y = target.properties.position.y / 2 + source.properties.position.y / 2;
      node.properties.position.x = target.properties.position.x / 2 + source.properties.position.x / 2;

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

  public constructor(public audioNode: T, name: string, component: DefineComponent<{}, {}, any>, position: IAmethystNodeProperties["position"], public isRemovable: boolean = true) {
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
    this.audioNode.connect(target.audioNode);
  }

  public disconnectFrom(target: AmethystAudioNode<AudioNode>) {
    this.connectedTo.splice(this.connectedTo.indexOf(target), 1);
    this.connections.splice(this.connections.findIndex(connection => connection.id === `edge-${this.properties.id}-${target.properties.id}`), 1);
    this.audioNode.disconnect(target.audioNode);
  }

  public disconnect() {
    
    this.connections.forEach(connection => {
      const source = usePlayer().nodeManager.nodes.find(node => node.connections.some(connection => connection.target === this.properties.id));
      const target = usePlayer().nodeManager.nodes.find(node => node.properties.id === connection.target);
      target && this.disconnectFrom(target);
      
      // And this node from it's current target
      // And connect them together as if this node never existed between them
      if (source && target) {
        source.connectTo(target);
      }
    });
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

    super(filter, name, LowpassFilterNode, position);
  }

  public override reset(){
    this.audioNode.frequency.value = 22050;
    this.audioNode.gain.value = 0;
  }
}

export class AmethystHighPassNode extends AmethystAudioNode<BiquadFilterNode> {
  public constructor(context: AudioContext, name: string, position: IAmethystNodeProperties["position"]) {
    const filter = context.createBiquadFilter().context.createBiquadFilter().context.createBiquadFilter().context.createBiquadFilter();
    
    filter.type = "highpass";
    filter.frequency.value = 20;
    filter.Q.value = -3;

    super(filter, name, HighpassFilterNode, position);
  }

  public override reset(){
    this.audioNode.frequency.value = 20;
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
    this.audioNode.pan.value = 0;
  }
}

export class AmethystGainNode extends AmethystAudioNode<GainNode> {
  public constructor(context: AudioContext, name: string, position: IAmethystNodeProperties["position"]) {
    super(context.createGain(), name, GainNode, position);
  }

  public override reset() {
    this.audioNode.gain.value = 1;
  }
}
