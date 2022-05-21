import type { Presence } from "discord-rpc";
import { Client } from "discord-rpc";
import { app } from "electron";

const isDebug
  = process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

const DEV_CLIENT_ID = "977664616568078408";
const PROD_CLIENT_ID = "976036303156162570";

// 539098687517095936
export default class Discord {
	public clientId = isDebug ? DEV_CLIENT_ID : PROD_CLIENT_ID;
	public client = new Client({ transport: "ipc" });
	constructor() {
		this.client.on("ready", () => {
			// Do something when ready
		});
		this.connect();
	}

	public connect() {
		this.client.login({ clientId: this.clientId }).catch(() => this.connect());
	}

	public clearRichPresesnce() {
		this.client.clearActivity();
	}

	public updateRichPresence(args: Presence) {
		this.client.setActivity(args);
	}

	public updateCurrentSong(title: string, duration: string, seek: string, status: string) {
		this.updateRichPresence({
			state: `${seek} - ${duration}`,
			details: title,
			largeImageKey: "logo",
			largeImageText: `Amethyst v${app.getVersion()}`,
			smallImageKey: status === "true" ? "play" : "pause",
			smallImageText: status === "true" ? "Playing" : "Paused",
			buttons: [
				{
					label: "Find Song",
					url: encodeURI(`https://www.youtube.com/results?search_query=${title}`),
				},
			],
		});
	}
}
