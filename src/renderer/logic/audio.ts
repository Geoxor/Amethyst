import { Position } from "@vue-flow/core";
import { DefineComponent, markRaw } from "vue";
import { player } from "@/logic/player";
import { Connection, NodeProperties } from "./audioManager";
import { v4 as uuidv4 } from "uuid";
 
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
      this.post.connect(target.pre);
    });
  }

  public connectTo(target: AmethystAudioNode) {
    if (this.connectedTo.includes(target)) return;
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
    // TODO: make this get the indexes of all target connections because it only disconnects the first target
    this.connections.splice(this.connections.findIndex(connection => connection.target === target.properties.id), 1);
    this.post.disconnect(target.pre);
  }

  public disconnect() {
    if (this.isBypassed) this.toggleBypass();

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

  public toggleBypass() {
    if (this.isBypassed) {
      this.connections.forEach(connection => {
        const parent = this.getParentNode();
        const child = player.nodeManager.nodes.value.find(node => node.properties.id === connection.target);
        
        // Reconnect this node
        child && this.post.connect(child.pre);
        parent && parent.post.connect(this.pre);
        parent && child && parent.post.disconnect(child.pre);

        this.isBypassed = false;
      });
    } else {
      this.connections.forEach(connection => {
        const parent = this.getParentNode();
        const child = player.nodeManager.nodes.value.find(node => node.properties.id === connection.target);
        
        // Bypass (disconnect) this node
        child && this.post.disconnect(child.pre);
        parent && parent.post.disconnect(this.pre);
        parent && child && parent.post.connect(child.pre);

        this.isBypassed = true;
      });
    }
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
}
