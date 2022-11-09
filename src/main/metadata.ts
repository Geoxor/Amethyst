import fs from "fs";
import * as mm from "music-metadata/lib/core";
import sharp from "sharp";

export class Metadata {
  public static async getCover(path: string): Promise<Buffer | undefined> {
		const file = await fs.promises.readFile(path);
		const meta = await mm.parseBuffer(file);

		return meta.common.picture?.[0].data;
	}

	public static async getResizedCover(path: string, resizeTo = 64): Promise<string | undefined> {
		const cover = await this.getCover(path);

		if (!cover)
			return;

		return (
			await sharp(cover).resize(resizeTo, resizeTo).webp().toBuffer()
		).toString("base64");
	}

	public static async getMetadata(path?: string) {
		return path && mm.parseBuffer(await fs.promises.readFile(path));
	}
}