import { amethyst } from "@/amethyst.js";

// TODO: hi geo, please make your own api keys at https://www.last.fm/api/account/create these for testing
const LAST_FM_API_KEY = "567fbeb21916c9bbbf33e57b4bec008f";
const LAST_FM_SECRET_KEY = "91e6024ca99e46fa9232e4af110f446a";

const generateLastFmApiSignature = (params: Map<string, string>) => {
    const entries = Array.from(params.entries())
        .sort(([aKey], [bKey]) => aKey.localeCompare(bKey));

    let str = '';
    entries.forEach(([key, value]) => {
        str += key + value;
    });

    str += LAST_FM_SECRET_KEY;

    // TODO: how do we generate md5 on mobile.
    return window.md5(str);
}

// https://www.last.fm/api/mobileauth
export const authenticateLastFm = async (): Promise<boolean> => {

    const params = new Map<string, string>();

    params.set("api_key", LAST_FM_API_KEY);
    params.set("method", "auth.getMobileSession");
    params.set("username", amethyst.state.settings.integrations.lastFm.username);
    params.set("password", amethyst.state.settings.integrations.lastFm.password);

    const result = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=${params.get("method")}&api_key=${params.get("api_key")}&username=${params.get("username")}&password=${params.get("password")}&api_sig=${generateLastFmApiSignature(params)}&format=json`,
        { method: "POST", headers: { "User-Agent": `Amethyst/${amethyst.VERSION}` } },
    );

    const payload = await result.json();

    if (payload["error"] == null) {
        amethyst.state.settings.integrations.lastFm.sessionKey = payload["session"]["key"]
        return true;
    }

    return false;
}

// https://www.last.fm/api/show/track.scrobble
export const scrobbleTrack = async (timestamp: number, track: string, artist: string) => {

    if (amethyst.state.settings.integrations.lastFm.sessionKey.length == 0)
        await authenticateLastFm();

    const params = new Map<string, string>();
    params.set("api_key", LAST_FM_API_KEY);
    params.set("method", "track.scrobble");
    params.set("timestamp", timestamp.toString());
    params.set("track", track);
    params.set("artist", artist);
    params.set("sk", amethyst.state.settings.integrations.lastFm.sessionKey);

    // TODO: do we need to validate the results?
    await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=${params.get("method")}&api_key=${params.get("api_key")}&timestamp=${params.get("timestamp")}&track=${params.get("track")}&artist=${params.get("artist")}&sk=${params.get("sk")}&api_sig=${generateLastFmApiSignature(params)}&format=json`,
        { method: "POST", headers: { "User-Agent": `Amethyst/${amethyst.VERSION}` } },
    );
}