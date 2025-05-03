import { Client, ActivityType } from "minimal-discord-rpc";
import { APP_VERSION } from "./mainWindow";

const DISCORD_CLIENT_ID = "976036303156162570"; 

export type FormatIcons = "aiff" | "flac" | "mpeg" | "ogg" | "wave";

export class Discord {
	private readonly client: Client;

	private readonly connected: Promise<boolean>;

	private destroyed: boolean;

	private timestamp: number;

	constructor() {
		this.client = new Client({ clientId: DISCORD_CLIENT_ID });

		this.connected = this.connect();
		this.destroyed = false;
		this.timestamp = Date.now();

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

	public updateCurrentSong(title: string, duration: string, albumUrl: String, format?: FormatIcons): void {
		this.connected.then(check => {
			if (check && !this.destroyed) {
				this.client.setActivity({
					type: ActivityType.Listening,
					details: title,
					state: duration,
					timestamps: {
						start: this.timestamp,
					},
					assets: {
						large_image: albumUrl !== "" ? `${albumUrl}` : "audio_file",
						large_text: format?.toUpperCase() || "Unknown Format",
						small_image: "logo",
						small_text: `Amethyst v${APP_VERSION}\n`,
					},
					buttons: [
						{
							label: "Find Song",
							url: `https://www.youtube.com/results?search_query=${encodeURIComponent(title)}`,
						},
					]
				});
			}
		});
	}
}
