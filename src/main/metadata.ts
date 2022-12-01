import fs from "fs";
import * as mm from "music-metadata/lib/core";
import { IMetadata } from "../shared/types";

export class Metadata {
	public static async getMetadata(path?: string): Promise<IMetadata | undefined> {
		if (!path) return;
		const file = await fs.promises.readFile(path);
		const {common, format} = await mm.parseBuffer(file);
		return {common, format, size: file.buffer.byteLength};
	}
}