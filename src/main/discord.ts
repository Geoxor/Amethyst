import type { Presence } from "discord-rpc";
import { Client } from "discord-rpc";
import { app } from "electron";

export default class Discord {
	public CLIENT_ID = "976036303156162570";
	public client = new Client({ transport: "ipc" });
	constructor() {
		this.client.on("ready", () => {
			// Do something when ready
		});
		this.connect();
	}

	public connect() {
		this.client.login({ clientId: this.CLIENT_ID }).catch(() => this.connect());
	}

	public clearRichPresesnce() {
		this.client.clearActivity();
	}

	public updateRichPresence(args: Presence) {
		this.client.setActivity(args);
	}

	public updateCurrentSong(title: string, duration: string, seek: string) {
		this.updateRichPresence({
			state: `${seek} - ${duration}`,
			details: title,
			largeImageKey: "logo",
			largeImageText: "Amethyst",
			smallImageKey: "logo",
			smallImageText: `Amethyst v${app.getVersion()}`,
			buttons: [
				{
					label: "Find Song",
					url: encodeURI(`https://www.youtube.com/results?search_query=${title}`),
				},
			],
		});
	}
}
