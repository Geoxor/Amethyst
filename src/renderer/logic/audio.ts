import { Position } from "@vue-flow/core";
import { v4 as uuid } from "uuid";
import { DefineComponent, markRaw } from "vue";
import { player } from "@/logic/player";
import { Connection, NodeProperties, Paramaters } from "./audioManager";
import type {Node} from "./audioManager";

export class AmethystAudioNode<T extends AudioNode> {
  public properties: NodeProperties;
  public connections: Connection[] = [];
  public isDisabled: boolean = false;
  protected connectedTo: (AmethystAudioNode<AudioNode>)[] = [];
  public component: DefineComponent<{}, {}, any>;

  public constructor(public audioNode: T, name: string, component: DefineComponent<{}, {}, any>, position: NodeProperties["position"], public isRemovable: boolean = true) {
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

  public loadPropertiesFromJSON(json: Node) {
    // overwrite the id to the .ang file
    this.properties.id = json.id;
    // @ts-ignore Set the parameters 
    json.paramaters && Object.entries(json.paramaters).forEach(([key, value]) => this[key] = value);
    // edge line connections
    this.connections = json.connections;
  }

  public getSlotName() {
    return `node-${this.properties.type}`;
  }

  protected connectAudioNode(target: AudioNode) {
    this.audioNode.connect(target);
  }

  public autoConnectFromEdges() {
    this.connections.forEach(edge => {
      const target = player.nodeManager.nodes.value.find(node => node.properties.id === edge.target);
      if (!target) return;
      this.connectedTo.push(target);
      this.connectAudioNode(target.audioNode);
    });
  }

  public connectTo(target: AmethystAudioNode<AudioNode>) {
    if (this.connectedTo.includes(target)) return;
    this.connectedTo.push(target);
    this.connections.push({ 
      id: uuid(), 
      source: this.properties.id, 
      target: target.properties.id 
    });
    
    this.connectAudioNode(target.audioNode);
  }

  public disconnectFrom(target: AmethystAudioNode<AudioNode>) {
    this.connectedTo.splice(this.connectedTo.indexOf(target), 1);
    // TODO: make this get the indexes of all target connections because it only disconnects the first target
    this.connections.splice(this.connections.findIndex(connection => connection.target === target.properties.id), 1);
    try {
      this.audioNode.disconnect(target.audioNode);
    } catch (error) {}
  }

  public disconnect() {
    // Disconnect descendants
    this.connections.forEach(connection => {
      const source = player.nodeManager.nodes.value.find(node => node.connections.some(connection => connection.target === this.properties.id));
      const target = player.nodeManager.nodes.value.find(node => node.properties.id === connection.target);
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

  public getParentNode(): AmethystAudioNode<AudioNode> | undefined{
    return player.nodeManager.nodes.value.find(node => node.connectedTo.find(node => node === this));
  }

  public updatePosition(newPosition: {x: number, y: number}) {
    this.properties.position = newPosition;
  }

  public reset(){
    throw new Error("Not implemented");
  };

  public getParameters(): Paramaters | undefined {
    console.log(`${this.properties.name} doesn't have any parameters`);
    return;
  }
}
