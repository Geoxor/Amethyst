import { Client, ActivityType } from "minimal-discord-rpc";
import { APP_VERSION } from "./mainWindow.js";

const DISCORD_CLIENT_ID = "976036303156162570"; 

export type FormatIcons = "aiff" | "flac" | "mpeg" | "ogg" | "wave";

export interface IRichPresenceInfo {
  title: string;
  album: string;
  timestamps: {
    start: number;
    end: number;
  }
  coverUrl: string;
  containerFormat: FormatIcons;
  pauseStatus: string;
}

export class Discord {
	private readonly client: Client;

	private readonly connected: Promise<boolean>;

	private destroyed: boolean;

	constructor() {
		this.client = new Client({ clientId: DISCORD_CLIENT_ID });

		this.connected = this.connect();
		this.destroyed = false;

		this.client.on("ready", () => {
			// Do something when ready
		});

		this.client.on("disconnected", () => this.destroyed = true);
	}

	public connect(): Promise<boolean> {
		return new Promise(resolve => {
			// The app will crash with status 3489660927 if the RPC won't connect unless rate limited
			this.client.login().then(() => resolve(true)).catch(() => resolve(false));
		});
	}

	public clearRichPresence(): void {
		this.connected.then(check => {
			if (check && !this.destroyed) {
				this.client.clearActivity();
			}
		});
	}

	public updateCurrentSong(info: IRichPresenceInfo): void {
		this.connected.then( check => {
			if (check && !this.destroyed) {
				this.client.setActivity({
					type: ActivityType.Listening,
					details: info.title.toString(),
					state: info.album.toString(),
					timestamps: info.pauseStatus == "yes" ? {
						start: info.timestamps.end,
						end: info.timestamps.end
					} : {
						start: info.timestamps.start,
						end: info.timestamps.end
					},
					assets: {
						large_image: info.coverUrl !== "" ? `${info.coverUrl}` : "audio_file",
						large_text: info.pauseStatus == "yes" ? `Paused - ${info.containerFormat?.toUpperCase() || "Unknown Format"}` : info.containerFormat?.toUpperCase() || "Unknown Format",
						small_image: "logo",
						small_text: `Amethyst ${APP_VERSION}\n`,
					},
					buttons: [
						{
							label: "Find Song",
							url: `https://www.youtube.com/results?search_query=${encodeURIComponent(info.title.toString())}`,
						}
					]
				});
			}
		});
	}
}
