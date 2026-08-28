import { ActivityType, Client } from "@nyabsi/minimal-discord-rpc";
import type { IRichPresenceInfo } from "@shared/types.js";

export const DEFAULT_DISCORD_CLIENT_ID = "976036303156162570";

export class Discord {
  private client: Client;

  private connected: Promise<boolean>;

  private destroyed: boolean;

  private clientId: string;

  constructor(clientId: string = DEFAULT_DISCORD_CLIENT_ID) {
    this.clientId = clientId || DEFAULT_DISCORD_CLIENT_ID;
    this.client = new Client({ clientId: this.clientId });
    this.destroyed = false;
    this.bindEvents();
    this.connected = this.connect();
  }

  private bindEvents(): void {
    this.client.on("ready", () => {
      // Do something when ready
    });

    this.client.on("disconnected", () => this.destroyed = true);
  }

  public connect(): Promise<boolean> {
    return new Promise((resolve) => {
      // The app will crash with status 3489660927 if the RPC won't connect unless rate limited
      this.client.login().then(() => resolve(true)).catch(() => resolve(false));
    });
  }

  /**
   * Swaps the RPC client over to a different Discord application (client) id, e.g. when the
   * user configures a custom one in settings. No-op if the id hasn't actually changed.
   */
  public setClientId(clientId: string): void {
    const id = clientId || DEFAULT_DISCORD_CLIENT_ID;
    if (id === this.clientId) return;

    this.clientId = id;
    this.client.destroy().catch(() => {});
    this.client = new Client({ clientId: id });
    this.destroyed = false;
    this.bindEvents();
    this.connected = this.connect();
  }

  public clearRichPresence(): void {
    this.connected.then((check) => {
      if (check && !this.destroyed) {
        this.client.clearActivity();
      }
    });
  }

  public updateCurrentSong(info: IRichPresenceInfo): void {
    this.connected.then((check) => {
      if (check && !this.destroyed) {
        this.client.setActivity({
          // `name` isn't in this library's Activity type, but it exists in the Discord API.
          // It's what fills the "{name}" in "Listening to {name}" on the MAIN activity card
          // (and everywhere else Discord shows the activity's name),
          // so leaving it unset (empty string -> undefined) falls back to Discord's own default,
          // the app's registered name ("Amethyst").
          name: info.activityName || undefined,
          type: ActivityType.Listening,
          details: info.details || undefined,
          state: info.state || undefined,
          timestamps: info.timestamps,
          assets: {
            large_image: info.largeImageKey || "audio_file",
            large_text: info.largeImageText || undefined,
            small_image: info.smallImageKey || undefined,
            small_text: info.smallImageText || undefined,
          },
          buttons: info.buttonEnabled && info.buttonUrl
            ? [{ label: info.buttonLabel, url: info.buttonUrl }]
            : undefined,
          // `status_display_type` isn't in this library's Activity type, but it exists in the Discord API.
          // It picks which of the app's own name/state/details fills the "{name}" slot in the compact status text shown in
          // a member list/DM sidebar (e.g. "Listening to {this}"), without renaming the activity
          // itself the way overriding `name` would (that also changes the main activity card).
          status_display_type: info.statusDisplayType,
        } as any);
      }
    });
  }
}
