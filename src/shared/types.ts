import type { ICommonTagsResult, IFormat } from "music-metadata";

export enum LoadStatus {
  Loading,
  Loaded,
}

export type Coords = { x: number; y: number };

export type LoadState<T> = {
  state: LoadStatus.Loading;
  data: undefined;
} | {
  state: LoadStatus.Loaded;
  data: T;
};

export interface IMetadata {
  format: IFormat;
  common: ICommonTagsResult & { [key: string]: any };
  size: number;
}

export const DISCORD_RPC_FIELD_OPTIONS = [
  "None",
  "Title",
  "Artist",
  "Album",
  "Artist - Album",
  "Title - Artist",
  "Format",
  "App Info",
] as const;

export type DiscordRpcField = typeof DISCORD_RPC_FIELD_OPTIONS[number];

export const DISCORD_STATUS_DISPLAY_TYPE_OPTIONS = ["Name", "State", "Details"] as const;
export type DiscordStatusDisplayType = typeof DISCORD_STATUS_DISPLAY_TYPE_OPTIONS[number];

export const STATUS_DISPLAY_TYPE_VALUES: Record<DiscordStatusDisplayType, number> = {
  Name: 0,
  State: 1,
  Details: 2,
};

export interface IRichPresenceInfo {
  activityName: string;
  details: string;
  state: string;
  largeImageKey: string;
  largeImageText: string;
  smallImageKey: string;
  smallImageText: string;
  timestamps: {
    start: number;
    end: number;
  };
  buttonEnabled: boolean;
  buttonLabel: string;
  buttonUrl: string;
  statusDisplayType: number;
}
