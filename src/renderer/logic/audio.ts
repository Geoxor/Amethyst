import { Position } from "@vue-flow/core";
import type { DefineComponent} from "vue";
import { markRaw } from "vue";
import type { Connection, NodeProperties } from "./audioManager";
import { v4 as uuidv4 } from "uuid";
import { amethyst } from "@/amethyst";
 
export interface NodeParameter<T> {
  current: T, // current
  min: T,
  max: T,
  step: T,
  default: T,
  unit: string,
}

export class AmethystAudioNode {
  public properties: NodeProperties;
  public connections: Connection[] = [];
  public isBypassed: boolean = false;
  private connectedTo: AmethystAudioNode[] = [];
  public component: DefineComponent<{}, {}, any>;

  public constructor(public pre: GainNode, public post: GainNode, name: string, component: DefineComponent<{}, {}, any>, position: NodeProperties["position"], public isRemovable: boolean = true, public isBypassable: boolean = true, public isResettable: boolean = true) {
    const id = uuidv4();
    
    this.properties = {
      name,
      id,
      type: `custom-${id}`,
      position,
      sourcePosition: Position.Right,
      icon: "ic-twotone-volume-up",
    };
    this.component = markRaw(component);
  }

  public getSlotName() {
    return `node-${this.properties.type}`;
  }

  public autoConnectFromEdges() {
    this.connections.forEach(edge => {
      const target = amethyst.player.nodeManager.nodes.value.find(node => node.properties.id === edge.target);
      if (!target) return;
      this.connectedTo.push(target);
      this.post.connect(target.pre);
    });
  }

  public connectTo(target: AmethystAudioNode) {
    if (this.connectedTo.includes(target)) return;
    if (target == this) return;
    this.connectedTo.push(target);
    this.connections.push({ 
      id: uuidv4(),
      source: this.properties.id, 
      target: target.properties.id 
    });
    this.post.connect(target.pre);
  }

  public disconnectFrom(target: AmethystAudioNode) {
    this.connectedTo.splice(this.connectedTo.indexOf(target), 1);
    this.connections = this.connections.filter(connection => connection.target != target.properties.id);
    this.post.disconnect(target.pre);
  }

  public disconnect() {
    if (this.isBypassed) this.toggleBypass();

    const sources = new Array<AmethystAudioNode>;
    const targets = new Array<AmethystAudioNode>;

    // Get, store and disconnect all connections
    this.connections.forEach(connection => {
      // Get node connected to this node
      const source = amethyst.player.nodeManager.nodes.value.find(node => node.connections.some(connection => connection.target === this.properties.id));
      // Get node connected by this node
      const target = amethyst.player.nodeManager.nodes.value.find(node => node.properties.id === connection.target);
      source && sources.push(source) && source.disconnectFrom(this);
      target && targets.push(target) && this.disconnectFrom(target);
    });

    sources.forEach(source => {
      targets.forEach(target => {
        source.connectTo(target);
      });
    });
  }

  public toggleBypass() {
    this.connections.forEach(connection => {
      const parents = this.getParentNodes();
      const children = amethyst.player.nodeManager.nodes.value.filter(node => node.properties.id === connection.target);
      
      if (this.isBypassed) {
        // Reconnect children back to this node
        children.forEach(child => this.post.connect(child.pre));

        // Reconnect parents back to this node
        parents.forEach(parent => parent.post.connect(this.pre));

        // Disconnect parents from children
        parents.forEach(parent => children.forEach(child => parent.post.disconnect(child.pre)));

        this.isBypassed = false;
      } else {
        // Disconnect children from this node
        children.forEach(child => this.post.disconnect(child.pre));
        
        // Disconnect parents from this node
        parents.forEach(parent => parent.post.disconnect(this.pre));

        // Connect parents to children
        parents.forEach(parent => children.forEach(child => parent.post.connect(child.pre)));

        this.isBypassed = true;
      }
    });
  }

  public getParentNodes(){
    return amethyst.player.nodeManager.nodes.value.filter(node => node.connectedTo.some(node => node.properties.id === this.properties.id));
  }

  public updatePosition(newPosition: {x: number, y: number}) {
    this.properties.position = newPosition;
  }

  public getParameters(): object {
    throw new Error("Not implemented");
  };

  public applyParameters(parameters: object) {
    throw new Error("Not implemented");
  }

  public reset(){
    throw new Error("Not implemented");
  };
}
