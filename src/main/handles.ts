import fs from "fs";
import path from "path";
import { ALLOWED_EXTENSIONS } from "./main";

export type FileTree = (string | string[])[];

export async function loadFolder(inputPath: string): Promise<FileTree> {
	const firstFolder = await fs.promises.readdir(inputPath);

	const files = await Promise.all(
		firstFolder.map(async (file) => {
			const filePath = path.join(inputPath, file);
			const stats = await fs.promises.stat(filePath);
			if (stats.isDirectory())
				return loadFolder(filePath);
			else if (stats.isFile() && ALLOWED_EXTENSIONS.includes(path.extname(filePath).slice(1)))
				return filePath;
			else return undefined;
		}),
	);

	return files.filter(file => !!file) as FileTree;
}
