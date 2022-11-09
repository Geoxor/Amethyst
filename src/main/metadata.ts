import fs from "fs";
import * as mm from "music-metadata/lib/core";
import { IAudioMetadata } from "music-metadata/lib/type";

export class Metadata {


	public static async getMetadata(path?: string): Promise<IAudioMetadata | undefined> {
		if (!path) return
		return mm.parseBuffer(await fs.promises.readFile(path));
	}
}