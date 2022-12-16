import { AmethystGainNode,
  AmethystFilterNode,
  AmethystPannerNode,
  AmethystInputNode,
  AmethystMasterNode,
  AmethystOutputNode,
  AmethystSpectrumNode, } from "@/nodes";
import { Coords } from "@shared/types";
import { Position as SourcePosition } from "@vue-flow/core";
import { Ref, ref } from "vue";
import { AmethystAudioNode } from "./audio";

const audioNodes: Record<string, any> = {
  AmethystGainNode,
  AmethystFilterNode,
  AmethystPannerNode,
  AmethystInputNode,
  AmethystMasterNode,
  AmethystOutputNode,
  AmethystSpectrumNode,
};

export interface NodeProperties {
  name: string,
  id: string,
  type: `custom-${string}`,
  position: Coords,
  sourcePosition: SourcePosition,
};

export interface Position {
  x: number;
  y: number;
}

export interface Connection {
  id: string;
  source: string;
  target: string;
}

export type Paramaters = Partial<{
  frequencyPercent: number;
  gain: number;
  Q: number;
  type: string;
  pan: number;
}>; 

export interface Node {
  name: string;
  id: string;
  position: Position;
  connections: Connection[];
  paramaters?: Paramaters;
}

export interface NodeGraph {
  version: number;
  nodes: Node[];
}

export class AmethystAudioNodeManager {
  private input!: AmethystInputNode;
  private output!: AmethystOutputNode;
  public master!: AmethystMasterNode;

  public nodes: Ref<AmethystAudioNode<AudioNode>[]> = ref([]);

  public constructor(public inputAudio: AudioNode, public context: AudioContext) {
    this.reset();
  }

  public reset () {
    this.nodes.value.forEach(node => node.disconnect());
    this.nodes.value = [];

    this.input = new AmethystInputNode(this.inputAudio, { x: 0, y: 0 });
    this.master = new AmethystMasterNode(this.context.createGain(), { x: 300, y: 0 });
    this.output = new AmethystOutputNode(this.context.destination, { x: 450, y: 0 });

    // navigator.mediaDevices.enumerateDevices().then(devices => {
    //   console.log("🚀 ~ file: audio.ts ~ line 43 ~ AmethystAudioNodeManager ~ constructor ~ devices", devices);
    //   const inputs = devices.filter(device => device.kind === "audioinput");
    //   const outputs = devices.filter(device => device.kind === "audiooutput");

    //   inputs.forEach((input, index) => {
    //     navigator.mediaDevices.getUserMedia({ audio: {deviceId: input.deviceId }}).then(stream => {
    //       const microphone = context.createMediaStreamSource(stream);
    //       const micInput = new AmethystAudioNode(microphone, "mic-input", InputNode, { x: 0, y: 52 + 52 * index }, false);
    //       this.nodes.value.push(micInput);
    //     });
    //   });
    // });

    this.input.connectTo(this.master);
    this.master.connectTo(this.output);

    this.nodes.value.push(this.input);
    this.nodes.value.push(this.master);
    this.nodes.value.push(this.output);
  }

  public loadGraph(graph: NodeGraph) {
    this.nodes.value.forEach(node => node.disconnect());

    this.nodes.value = [];
    graph.nodes.forEach(node => {
      let nodeInstance: AmethystAudioNode<any> | null = null;
      switch (node.name) {
        case "AmethystInputNode":
          this.input = new AmethystInputNode(this.inputAudio, node.position);
          nodeInstance = this.input;
          break;
        case "AmethystMasterNode":
          this.master = new AmethystMasterNode(this.context.createGain(), node.position);
          nodeInstance = this.master;
          break;
        case "AmethystOutputNode":
          this.output = new AmethystOutputNode(this.context.destination, node.position);
          nodeInstance = this.output;
          break;
        default:
          nodeInstance = new audioNodes[node.name](this.context, node.position);
          break;
      }

      if (!nodeInstance) return; 
    
      // overwrite the id to the .ang file
      nodeInstance.properties.id = node.id;
      // @ts-ignore Set the parameters 
      node.paramaters && Object.entries(node.paramaters).forEach(([key, value]) => nodeInstance[key] = value);
      // edge line connections
      nodeInstance.connections = node.connections;
      // connect webaudio nodes from edge line connections
      this.nodes.value.push(nodeInstance);
    });

    // Do this after so we make sure all nodes exist because they get loaded
    // in a random order and that may cause them to not connect because
    // they don't exist yet
    this.nodes.value.forEach(node => node.autoConnectFromEdges());
  }

  public serialize() {

    const nodeGraph: NodeGraph = {
      version: 1,
      nodes: this.nodes.value.map(node => ({
        name: node.properties.name,
        id: node.properties.id,
        position: node.properties.position,
        connections: node.connections,
        paramaters: node.getParameters(),
      }))
    };

    return JSON.stringify(nodeGraph, null, 2);
  }

  public removeNode(node: AmethystAudioNode<AudioNode>) {
    if (!node.isRemovable) return;
    node.disconnect();
    this.nodes.value.splice(this.nodes.value.findIndex(n => n.properties.id === node.properties.id), 1);
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
    
    this.nodes.value.push(node);
  }

  public getNodeProperties() {
    return this.nodes.value.map(node => node.properties);
  }

  public getNodeComponents() {
    return this.nodes.value.map(node => node.component);
  }

  public getNodeConnections() {
    const allConnections: Connection[] = [];

    this.nodes.value.forEach(node => {
      node.connections.forEach(connection => allConnections.push(connection));
    });

    return allConnections;
  }

  public getNodeConnectinsString() {
    return this.getNodeConnections().toString();
  }
}
