import { useState } from "./amethyst";

export interface NotificationOptions {
  title: string;
  body: string;
  sound?: string;
  timeout?: number;
}

export class AmethystNotification {
  public title: string;
  public body: string;
  public sound?: string;

  constructor(options: NotificationOptions) {
    this.title = options.title;
    this.body = options.body;
    this.sound = options.sound;

    this.show();
  }

  private show() {
    const state = useState();
    // if more than 99 notifications, remove the oldest one
    if (state.state.notifications.length >= 99) {
      state.state.notifications.pop();
    }
    state.state.notifications.unshift(this);
  }

  public clear() {
    const state = useState();
    state.state.notifications = state.state.notifications.filter(
      (notification) => notification !== this
    );
  }
}