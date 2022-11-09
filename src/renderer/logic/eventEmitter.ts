import mitt, { EventType } from "mitt";

export class EventEmitter<T extends Record<EventType, any>> {
  private events = mitt<T>();
	protected emit = this.events.emit;
	public on = this.events.on;
	public off = this.events.off;
}