import fs from "fs";
import path from "path";
import { ipcMain } from "electron";
import * as mm from "music-metadata/lib/core";
import MusicParser from "./music-parser";

const LIBRARY_PATH = "F:/Programming/projects/collaboration/amethyst/music";

ipcMain.handle("load-library", () => MusicParser.loadMusic(LIBRARY_PATH));

ipcMain.handle("get-metadata", async (_event, args) => {
	return await mm.parseBuffer(fs.readFileSync(args[0]));
});

ipcMain.handle("open-folder", (_event, args) => {
	return fs.readdirSync(args[0]).map(file =>
		path.join(args[0], file),
	);
});

// ipcMain.on('ipc-example', async (event, arg) => {
//   const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
//   console.log(msgTemplate(arg));
//   event.reply('ipc-example', msgTemplate('pong'));
// });

