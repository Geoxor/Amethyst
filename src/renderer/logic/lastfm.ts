import crypto from 'crypto';
import {Amethyst} from "@/amethyst.js";

const LAST_FM_API_KEY = "567fbeb21916c9bbbf33e57b4bec008f";
const LAST_FM_SECRET_KEY = "91e6024ca99e46fa9232e4af110f446a";
const LAST_FM_API_BASE = "https://ws.audioscrobbler.com/2.0";

const generateLastFmApiSignature = (params: Map<string, string>) => {
    const entries = Array.from(params.entries())
        .sort(([aKey], [bKey]) => aKey.localeCompare(bKey));

    let str = '';
    entries.forEach(([key, value]) => {
        str += key + value;
    });

    str += LAST_FM_SECRET_KEY;

    return crypto.createHash('md5').update(str, 'utf-8').digest('hex');
}

const encodeUrlParams = (params: Map<string, string>): string => {
    const urlParams = new URLSearchParams();
    params.forEach((value, key) => {
        urlParams.append(key, value);
    });
    return urlParams.toString();
}

export class LastFm {

    private needsReAuthentication = false;

    constructor(private amethyst: Amethyst) { }

    public isScrobblingEnabled(): boolean {
        return this.amethyst.state.settings.integrations.lastFm.enabled && this.amethyst.state.settings.integrations.lastFm.enableScrobbling;
    }

    private handleServerErrorResponse(error: number) {
        if (error == 9) {
            this.needsReAuthentication = true;
        }
    }

    // https://www.last.fm/api/mobileauth
    private async authenticate(force: boolean = false): Promise<boolean> {

        if (this.amethyst.state.settings.integrations.lastFm.sessionKey.length == 0 || force)
        {
            const params = new Map<string, string>();

            params.set("api_key", LAST_FM_API_KEY);
            params.set("method", "auth.getMobileSession");
            params.set("username", this.amethyst.state.settings.integrations.lastFm.username);
            params.set("password", this.amethyst.state.settings.integrations.lastFm.password);

            const signature = generateLastFmApiSignature(params);
            const urlParams = encodeUrlParams(params);

            const result = await fetch(
                `${LAST_FM_API_BASE}/?${urlParams}&api_sig=${signature}&format=json`,
                { method: "POST", headers: { "User-Agent": `Amethyst/${this.amethyst.VERSION}` } },
            );

            const payload = await result.json();

            if (payload["error"] == null) {
                console.log(`%c[⚐ Last.fm]%c Authenticated as ${payload["session"]["name"]}`, "background-color: #ff4800; color: black; font-weight: bold;", "color:rgb(255, 200, 0);", payload);
                this.amethyst.state.settings.integrations.lastFm.sessionKey = payload["session"]["key"]
                return true;
            } else {
                console.log(`%c[⚐ Last.fm]%c Authenticated returned error`, "background-color: #ff4800; color: black; font-weight: bold;", "color:rgb(255, 200, 0);", payload);
            }

            return false;
        }

        return true;
    }

    // https://www.last.fm/api/show/track.scrobble
    public scrobble(timestamp: number, track: string, artist: string) {
        this.authenticate(this.needsReAuthentication).then(async (authenticated) => {
            if (authenticated) {
                const params = new Map<string, string>();
                params.set("api_key", LAST_FM_API_KEY);
                params.set("method", "track.scrobble");
                params.set("timestamp", timestamp.toString());
                params.set("track", track);
                params.set("artist", artist);
                params.set("sk", this.amethyst.state.settings.integrations.lastFm.sessionKey);

                const signature = generateLastFmApiSignature(params);
                const urlParams = encodeUrlParams(params);

                const result = await fetch(
                    `${LAST_FM_API_BASE}/?${urlParams}&api_sig=${signature}&format=json`,
                    { method: "POST", headers: { "User-Agent": `Amethyst/${this.amethyst.VERSION}` } },
                );

                const payload = await result.json();

                if (payload["error"] == null) {
                    console.log(`%c[⚐ Last.fm]%c Scrobble -> ${track} by ${artist} was ${payload["scrobbles"]["@attr"]["accepted"] > 0 ? "Accepted" : "Rejected"}`, "background-color: #ff4800; color: black; font-weight: bold;", "color:rgb(255, 200, 0);", payload);
                } else {
                    console.log(`%c[⚐ Last.fm]%c Scrobble returned error (${payload["error"]})`, "background-color: #ff4800; color: black; font-weight: bold;", "color:rgb(255, 200, 0);", payload);

                    this.handleServerErrorResponse(payload["error"]);
                }
            }
        });
    }
}