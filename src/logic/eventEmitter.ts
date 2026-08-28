import type { Emitter, EventType } from "mitt";
import mitt from "mitt";

export class EventEmitter<T extends Record<EventType, any>> {
  // @ts-ignore node16 type import issue with mitt
  private events: Emitter<T> = mitt<T>();
  public emit = this.events.emit;
  public on = this.events.on;
  public off = this.events.off;
}
