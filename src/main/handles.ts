import fs from "fs";
import path from "path";

export const loadFolder = async (inputPath: string) => {
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

						else if (stats.isFile())
							return filePath;
					}),
				).then(resolve);
			}
		});
	});
};
