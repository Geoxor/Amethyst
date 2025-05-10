import type { EventType } from "mitt";
import mitt from 'mitt';

export class EventEmitter<T extends Record<EventType, any>> {
  private events = mitt<T>();
	public emit = this.events.emit;
	public on = this.events.on;
	public off = this.events.off;
}