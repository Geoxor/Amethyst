import { Position } from "@vue-flow/core";
import { DefineComponent, markRaw } from "vue";
import { player } from "@/logic/player";
import { Connection, NodeProperties, Paramaters } from "./audioManager";

export class AmethystAudioNode<T extends AudioNode> {
  public properties: NodeProperties;
  public connections: Connection[] = [];
  public isDisabled: boolean = false;
  private connectedTo: (AmethystAudioNode<AudioNode>)[] = [];
  public component: DefineComponent<{}, {}, any>;

  public constructor(public audioNode: T, name: string, component: DefineComponent<{}, {}, any>, position: NodeProperties["position"], public isRemovable: boolean = true) {
    const id = crypto.randomUUID();
    
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

  public autoConnectFromEdges() {
    this.connections.forEach(edge => {
      const target = player.nodeManager.nodes.value.find(node => node.properties.id === edge.target);
      if (!target) return;
      this.connectedTo.push(target);
      this.audioNode.connect(target.audioNode);
    });
  }

  public connectTo(target: AmethystAudioNode<AudioNode>) {
    if (this.connectedTo.includes(target)) return;
    this.connectedTo.push(target);
    this.connections.push({ 
      id: crypto.randomUUID(), 
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

  public getParentNode(){
    return player.nodeManager.nodes.value.find(node => node.connectedTo.some(node => node.properties.id === this.properties.id));
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
