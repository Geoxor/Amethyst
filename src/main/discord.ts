import type { Presence } from "discord-rpc";
import { Client } from "discord-rpc";
import { APP_VERSION, IS_DEBUG } from "./main";

const DEV_CLIENT_ID = "977664616568078408";
const PROD_CLIENT_ID = "976036303156162570";

// 539098687517095936
export class Discord {
	private readonly client: Client;

    private readonly connected: Promise<boolean>;

    private destroyed: boolean;

	constructor() {
        this.client = new Client({ transport: "ipc" });
        this.connected = this.connect();
        this.destroyed = false;

		this.client.on("ready", () => {
			// Do something when ready
		});
        this.client.once("disconnected", () => this.destroyed = true);
	}

	public connect(): Promise<boolean> {
        return new Promise((resolve) => {
            // The app will crash with status 3489660927 if the RPC won't connect unless rate limited
            this.client.login({
                clientId: IS_DEBUG ? DEV_CLIENT_ID : PROD_CLIENT_ID,
            }).then(() => resolve(true)).catch(() => resolve(false));
        });
	}

	public clearRichPresence(): void {
        this.connected.then(check => check && !this.destroyed && this.client.clearActivity());
	}

	public updateRichPresence(args: Presence): void {
		this.connected.then(check => check && !this.destroyed && this.client.setActivity(args));
	}

	public updateCurrentSong(title: string, duration: string, seek: string, status: boolean): void {
		this.connected.then(check => check && !this.destroyed && this.updateRichPresence({
			state: `${seek} - ${duration}`,
			details: title,
			largeImageKey: "logo",
			largeImageText: `Amethyst v${APP_VERSION}`,
			smallImageKey: status ? "play" : "pause",
			smallImageText: status ? "Playing" : "Paused",
			buttons: [
				{
					label: "Find Song",
					url: encodeURI(`https://www.youtube.com/results?search_query=${title}`),
				},
			],
		}));
	}
}
