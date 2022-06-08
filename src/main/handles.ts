import fs from "fs";
import path from "path";
import { ALLOWED_EXTENSIONS } from "./main";

export type FileTree = (string | string[])[];

export async function loadFolder(inputPath: string) {
	return new Promise((resolve, reject) => {
		fs.readdir(inputPath, (error, files) => {
			if (error) {
				reject(error);
			}
			else {
				Promise.all(
					files.map(async (file) => {
						const filePath = path.join(inputPath, file);
						const stats = await fs.promises.stat(filePath);
						if (stats.isDirectory())
							return loadFolder(filePath);
						else if (stats.isFile() && ALLOWED_EXTENSIONS.includes(path.extname(filePath).slice(1)))
							return filePath;
					}),
				).then(files => resolve(files.filter(file => !!file)));
			}
		});
	});
}
