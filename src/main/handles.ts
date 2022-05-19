import fs from "fs";
import path from "path";
import { ipcMain } from "electron";
import * as mm from "music-metadata/lib/core";

ipcMain.handle("get-metadata", async (_event, args) => {
	return await mm.parseBuffer(fs.readFileSync(args[0]));
});

const loadFolder = async (inputPath: string) => {
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

ipcMain.handle("open-folder", async (_event, args) => {
	return await loadFolder(args[0]);
});

// ipcMain.on('ipc-example', async (event, arg) => {
//   const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
//   console.log(msgTemplate(arg));
//   event.reply('ipc-example', msgTemplate('pong'));
// });

