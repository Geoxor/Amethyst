import { SubsonicAPI } from "subsonic-api";

export interface SubsonicServerOptions {
  url: string,
  type: "subsonic" | "generic" | "navidrome",
  password: string,
  username: string,
}

export const connectToSubsonicServer = async (options: SubsonicServerOptions) => {
  const api = new SubsonicAPI({
    url: options.url,
    type: options.type,
  });

  await api.login({
    username: options.username,
    password: options.password,
  });

  console.log(`Subsonic: Logged in to server ${options.url} with username: ${options.username}`);

  return api;
};