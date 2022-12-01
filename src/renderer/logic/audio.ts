import InputNode from "@/components/nodes/InputNode.vue";
import MasterNode from "@/components/nodes/MasterNode.vue";
import OutputNode from "@/components/nodes/OutputNode.vue";
import { Position } from "@vue-flow/core";
import { v4 as uuid } from "uuid";
import { DefineComponent, markRaw, ref } from "vue";
import { player } from "@/logic/player";
import { Coords } from "../../shared/types";

export interface IAmethystNodeProperties {
  name: string,
  id: string,
  type: `custom-${string}`,
  position: Coords,
  sourcePosition: Position,
};

export interface IAmethystNodeConnection {
  id: string,
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

    // navigator.mediaDevices.enumerateDevices().then(devices => {
    //   console.log("🚀 ~ file: audio.ts ~ line 43 ~ AmethystAudioNodeManager ~ constructor ~ devices", devices);
    //   const inputs = devices.filter(device => device.kind === "audioinput");
    //   const outputs = devices.filter(device => device.kind === "audiooutput");

    //   inputs.forEach((input, index) => {
    //     navigator.mediaDevices.getUserMedia({ audio: {deviceId: input.deviceId }}).then(stream => {
    //       const microphone = context.createMediaStreamSource(stream);
    //       const micInput = new AmethystAudioNode(microphone, "mic-input", InputNode, { x: 0, y: 52 + 52 * index }, false);
    //       this.nodes.push(micInput);
    //     });
    //   });
    // });

    this.master = new AmethystAudioNode(this.context.createGain(), "master", MasterNode, { x: 300, y: 0 }, false);
    this.output = new AmethystAudioNode(this.context.destination, "output", OutputNode, { x: 450, y: 0 }, false);

    this.input.connectTo(this.master);
    this.master.connectTo(this.output);

    this.nodes.push(this.input);
    this.nodes.push(this.master);
    this.nodes.push(this.output);
  }

  public serialize() {
    return JSON.stringify({
      version: 1,
      nodes: this.nodes.map(({connections, properties, component}) => ({
        name: properties.name,
        component_name: component.__name,
        id: properties.id,
        position: properties.position,
        connections,
      }))
    }, null, 2);
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
    const id = uuid();
    
    this.properties = {
      name,
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
    if (this.connectedTo.includes(target)) return;
    this.connectedTo.push(target);
    this.connections.push({ 
      id: uuid(), 
      source: this.properties.id, 
      target: target.properties.id 
    });
    this.audioNode.connect(target.audioNode);
  }

  public disconnectFrom(target: AmethystAudioNode<AudioNode>) {
    this.connectedTo.splice(this.connectedTo.indexOf(target), 1);
    // TODO: make this get the indexes of all target connections because it only disconnects the first target
    this.connections.splice(this.connections.findIndex(connection => connection.target === target.properties.id), 1);
    this.audioNode.disconnect(target.audioNode);
  }

  public disconnect() {
    // Disconnect descendants
    this.connections.forEach(connection => {
      const source = player.nodeManager.nodes.find(node => node.connections.some(connection => connection.target === this.properties.id));
      const target = player.nodeManager.nodes.find(node => node.properties.id === connection.target);
      target && this.disconnectFrom(target);
      
      // And this node from it's current target
      // And connect them together as if this node never existed between them
      if (source && target) {
        source.connectTo(target);
      }
    });

    // Disconnect parents
    this.getParentNode()?.disconnectFrom(this);
  }

  public getParentNode(){
    return player.nodeManager.nodes.find(node => node.connectedTo.some(node => node.properties.id === this.properties.id));
  }

  public updatePosition(newPosition: {x: number, y: number}) {
    this.properties.position = newPosition;
  }

  public reset(){
    throw new Error("Not implemented");
  };
}
