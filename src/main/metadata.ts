import fs from "fs";
import * as mm from "music-metadata/lib/core";
import { ICommonTagsResult, IFormat } from "music-metadata/lib/type";

export interface IMetadata {
	format: IFormat;
	common: ICommonTagsResult;
}

export class Metadata {
	public static async getMetadata(path?: string): Promise<IMetadata | undefined> {
		if (!path) return;
		const {common, format} = await mm.parseBuffer(await fs.promises.readFile(path));
		return {common, format};
	}
}