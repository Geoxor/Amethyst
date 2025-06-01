import crypto from "crypto";

import { Amethyst } from "@/amethyst.js";

const LAST_FM_API_KEY = "b9005f3705fc0316ccc4d48f9ac36da0";
const LAST_FM_SHARED_KEY = "471c8828e574a4d6bd39a91810b14dcb";
const LAST_FM_API_BASE = "https://ws.audioscrobbler.com/2.0";

const LAST_FM_ERROR_CODE_MAP: Map<number, string> = new Map<number, string>([
  [2, "Invalid service - This service does not exist"],
  [3, "Invalid Method - No method with that name in this package"],
  [4, "Authentication Failed - You do not have permissions to access the service"],
  [5, "Invalid format - This service doesn't exist in that format"],
  [6, "Invalid parameters - Your request is missing a required parameter"],
  [7, "Invalid resource specified"],
  [8, "Operation failed - Something else went wrong"],
  [9, "Invalid session key - Please re-authenticate"],
  [10, "Invalid API key - You must be granted a valid key by last.fm"],
  [11, "Service Offline - This service is temporarily offline. Try again later."],
  [13, "Invalid method signature supplied"],
  [16, "There was a temporary error processing your request. Please try again"],
  [26, "Suspended API key - Access for your account has been suspended, please contact Last.fm"],
  [29, "Rate limit exceeded - Your IP has made too many requests in a short period"],
]);

const generateLastFmApiSignature = (params: Map<string, string>) => {
  const entries = Array.from(params.entries())
    .sort(([aKey], [bKey]) => aKey.localeCompare(bKey));

  let str = "";
  entries.forEach(([key, value]) => {
    str += key + value;
  });

  str += LAST_FM_SHARED_KEY;

  return crypto.createHash("md5").update(str, "utf-8").digest("hex");
};

const encodeUrlParams = (params: Map<string, string>): string => {
  const urlParams = new URLSearchParams();
  params.forEach((value, key) => {
    urlParams.append(key, value);
  });
  return urlParams.toString();
};

export class LastFm {
  private needsReAuthentication = false;

  constructor(private amethyst: Amethyst) { }

  public isScrobblingEnabled(): boolean {
    return this.amethyst.state.settings.integrations.lastFm.enabled && this.amethyst.state.settings.integrations.lastFm.enableScrobbling;
  }

  private handleServerError(error: number, url: string) {
    console.log(`%c[⚐ Last.fm]%c ${url} returned ${error}, ${LAST_FM_ERROR_CODE_MAP.get(error)}`, "background-color: #ff4800; color: black; font-weight: bold;", "color:rgb(255, 200, 0);");

    switch (error) {
      case 9:
        this.needsReAuthentication = true;
        break;
      default:
        break;
    }
  }

  private async sendRequest(method: string, urlParams: string, signature: string): Promise<any> {
    const methodUrl = `${LAST_FM_API_BASE}/?${urlParams}&api_sig=${signature}&format=json`;
    const result = await fetch(
      methodUrl,
      { method: method, headers: { "User-Agent": `Amethyst/${this.amethyst.VERSION}` } },
    );

    const payload = await result.json();

    if (payload["error"] == null) {
      return payload;
    }
    else {
      this.handleServerError(payload["error"], methodUrl);
      return null;
    }
  }

  // https://www.last.fm/api/mobileauth
  private async authenticate(): Promise<boolean> {
    if (this.amethyst.state.settings.integrations.lastFm.sessionKey.length == 0 || this.needsReAuthentication) {
      const params = new Map<string, string>();

      params.set("api_key", LAST_FM_API_KEY);
      params.set("method", "auth.getMobileSession");
      params.set("username", this.amethyst.state.settings.integrations.lastFm.username);
      params.set("password", this.amethyst.state.settings.integrations.lastFm.password);

      const signature = generateLastFmApiSignature(params);
      const urlParams = encodeUrlParams(params);

      const result = await this.sendRequest("POST", urlParams, signature);

      if (result !== null) {
        console.log(`%c[⚐ Last.fm]%c Authenticated as ${result["session"]["name"]}`, "background-color: #ff4800; color: black; font-weight: bold;", "color:rgb(255, 200, 0);", result);
        this.amethyst.state.settings.integrations.lastFm.sessionKey = result["session"]["key"];
        this.needsReAuthentication = false;
        return true;
      }

      return false;
    }

    return true;
  }

  // https://www.last.fm/api/show/track.scrobble
  public scrobble(timestamp: number, track: string, artist: string) {
    this.authenticate().then(async (authenticated) => {
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

        const result = await this.sendRequest("POST", urlParams, signature);

        if (result !== null) {
          console.log(`%c[⚐ Last.fm]%c Scrobble -> ${track} by ${artist} was ${result["scrobbles"]["@attr"]["accepted"] > 0 ? "Accepted" : "Rejected"}`, "background-color: #ff4800; color: black; font-weight: bold;", "color:rgb(255, 200, 0);", result);
        }
      }
    });
  }
}
