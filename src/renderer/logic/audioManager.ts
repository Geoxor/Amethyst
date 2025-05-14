import type { Coords } from "@shared/types.js";
import type { Position as SourcePosition } from "@vue-flow/core";
import { useLocalStorage } from "@vueuse/core";
import type { Ref} from "vue";
import { ref } from "vue";

import type { Amethyst } from "@/amethyst.js";
import type { AmethystAudioNode } from "@/logic/audio.js";
import {   AmethystFilterNode,
AmethystGainNode,
  AmethystInputNode,
  AmethystMasterNode,
  AmethystOutputNode,
  AmethystPannerNode,
  AmethystSpectrumNode, } from "@/nodes/index.js";

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
  icon: string,
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

export interface Node {
  name: string;
  id: string;
  position: Position;
  connections: Connection[];
  paramaters?: {[key: string]: any};
}

export interface NodeGraph {
  version: number;
  nodes: Node[];
}

export class AmethystAudioNodeManager {
  private input!: AmethystInputNode;
  private output!: AmethystOutputNode;
  public master!: AmethystMasterNode;

  public graphName: Ref<string> = ref("");
  public graphPath: Ref<string> = useLocalStorage("lastNodeGraphPath", "");

  public nodes: Ref<AmethystAudioNode[]> = ref([]);

  public constructor(public inputAudio: AudioNode, public context: AudioContext, private amethyst: Amethyst) {
    this.init();

    // Load previous node graph if there was one
    this.graphPath.value && this.fetchGraph(this.graphPath.value); 
  }

  public init () {
    this.nodes.value.forEach(node => node.disconnect());
    this.nodes.value = [];

    this.input = new AmethystInputNode(this.inputAudio, { x: 0, y: 0 });
    this.master = new AmethystMasterNode(this.context, { x: 300, y: 0 });
    this.output = new AmethystOutputNode(this.context, { x: 450, y: 0 }, this.amethyst);

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

  public reset () {
    this.graphName.value = "";
    this.graphPath.value = "";
    this.init();
  }

  private fetchGraph(path: string) {
    fetch(path)
      .then(response => response.blob())
      .then(blob => {
        return new Promise<ArrayBuffer>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(blob);
          reader.onloadend = () => reader.result ? resolve(reader.result as ArrayBuffer) : reject("reader null");
        });
      })
      .then(buffer => {
        const decoder = new TextDecoder("utf-8");
        const jsonString = decoder.decode(buffer);

        // Use the loaded buffer
        this.loadGraph(JSON.parse(jsonString), path);
      });
  }

  public loadGraph(graph: NodeGraph, path: string) {
    this.nodes.value.forEach(node => node.disconnect());

    this.nodes.value = [];
    graph.nodes.forEach(node => {
      let nodeInstance: AmethystAudioNode | null = null;
      switch (node.name) {
        case "AmethystInputNode":
          this.input = new AmethystInputNode(this.inputAudio, node.position);
          nodeInstance = this.input;
          break;
        case "AmethystMasterNode":
          this.master = new AmethystMasterNode(this.context, node.position);
          nodeInstance = this.master;
          break;
        case "AmethystOutputNode":
          this.output = new AmethystOutputNode(this.context, node.position, this.amethyst);
          nodeInstance = this.output;
          break;
        default:
          nodeInstance = new audioNodes[node.name](this.context, node.position);
          break;
      }

      if (!nodeInstance) return; 
    
      // overwrite the id to the .ang file
      nodeInstance.properties.id = node.id;
      // apply parameters from json to the node
      node.paramaters && Object.keys(node.paramaters).length !== 0 && nodeInstance.applyParameters(node.paramaters);
      // edge line connections
      nodeInstance.connections = node.connections;
      // connect webaudio nodes from edge line connections
      this.nodes.value.push(nodeInstance);

      this.graphName.value = window.path.parse(window.path.basename(path)).name;
      this.graphPath.value = path;
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

  public removeNode(node: AmethystAudioNode) {
    if (!node.isRemovable) return;
    node.disconnect();
    this.nodes.value.splice(this.nodes.value.findIndex(n => n.properties.id === node.properties.id), 1);
  }

  public addNode(node: AmethystAudioNode, betweenNodes?: [AmethystAudioNode, AmethystAudioNode]) {
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

  public getNodeConnectionsString() {
    return this.getNodeConnections().toString();
  }
}
