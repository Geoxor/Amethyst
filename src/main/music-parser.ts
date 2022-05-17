import fs from "fs";
import * as mm from "music-metadata/lib/core";
import type { IAudioMetadata } from "music-metadata/lib";

export default class MusicParser {
	public static async parse(file: string): Promise<IAudioMetadata> {
		const buffer = fs.readFileSync(file);
		return mm.parseBuffer(buffer);
	}

	public static async readDirectory(dir: string): Promise<string[]> {
		return fs.readdirSync(dir);
	}

	public static async loadMusic(dir: string): Promise<IAudioMetadata[]> {
		const validExtensions = [".mp3", ".flac"];
		const files = await this.readDirectory(dir);
		const music = await Promise.all(
			files
				.filter(file =>
					validExtensions.some(validExtention =>
						file.endsWith(validExtention),
					),
				)
				.map(async (file) => {
					const path = `${dir}/${file}`;

					console.log(path);

					return {
						...(await mm.parseBuffer(fs.readFileSync(path))),
						path,
					};
				}),
		);
		return music;
	}
}
