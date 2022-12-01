import { IFormat, ICommonTagsResult } from "music-metadata";

export enum LoadStatus {
  Loading,
  Loaded
}

export type Coords = {x: number, y: number};

export type LoadState<T> = {
  state: LoadStatus.Loading,
  data: undefined
} | {
  state: LoadStatus.Loaded,
  data: T
};

export interface IMetadata {
	format: IFormat;
	common: ICommonTagsResult & {[key: string]: any};
	size: number;
}
