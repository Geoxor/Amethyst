import fs from "fs";
import path from "path";
import * as mm from "music-metadata/lib/core";
import type { Event } from "electron";
import { BrowserWindow, dialog, ipcMain, shell } from "electron";
import sharp from "sharp";
import { ALLOWED_EXTENSIONS, APP_VERSION, IS_DEV, RESOURCES_PATH } from "./main";

import { resolveHTMLPath } from "./util";
import { loadFolder } from "./handles";
import { Discord } from "./discord";

 
export class MainWindow {
	public readonly window: BrowserWindow;
	public preferencesWindow: BrowserWindow | undefined = undefined;
	
	private readonly windowOptions = {
		show: false,
		width: 1024,
		height: 728,
		icon: path.join(RESOURCES_PATH, `icon${IS_DEV ? "-dev" : ""}.png`),
		frame: false,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			webSecurity: false,
		},
	}

	private readonly discord: Discord;


	constructor() {
		this.window = new BrowserWindow(this.windowOptions);
		this.discord = new Discord();

		this.setIpcEvents();
		this.setWindowEvents();
	}

	public show(): void {
		this.window.loadURL(resolveHTMLPath("index"));

		this.window.on("ready-to-show", () => {
			if (process.env.START_MINIMIZED)
				this.window.minimize();
			else
				this.window.show();
		});
	}

	public destroy(): void {
		this.window.destroy();
	}

	public playAudio(path: string): void {
		this.window.webContents.send("play-file", path);
	}

	private setWindowEvents(): void {
		this.window.on("minimize", () => this.window.webContents.send("minimize"));
		this.window.on("maximize", () => this.window.webContents.send("maximize"));
		this.window.on("closed", () => this.destroy());
		this.window.webContents.on("dom-ready", () => {
			if (process.argv[1])
				this.playAudio(process.argv[1]);

			this.window.webContents.send("default-cover", fs.readFileSync(
				path.join(RESOURCES_PATH, "/images/default-cover.png"),
			));
			this.window.webContents.send(
				"version",
				APP_VERSION + (IS_DEV ? " DEV-BUILD" : ""),
			);
			this.window.webContents.send("acceptable-extensions", ALLOWED_EXTENSIONS);
		});
		// Open urls in the user's browser
		this.window.webContents.setWindowOpenHandler((data) => {
			shell.openExternal(data.url);

			return { action: "deny" };
		});
	}

	private setIpcEvents(): void {
		Object.entries({
			// Temporary fix
			"minimize": (_: Event, [window]: string[]) => window === "preferences" ? this.preferencesWindow?.minimize() : this.window.minimize(),
			// Temporary fix
			"maximize": (_: Event, [window]: string[]) => window === "preferences" ? this.preferencesWindow?.maximize() : this.window.maximize(),
			// Temporary fix
			"unmaximize": (_: Event, [window]: string[]) => window === "preferences" ? this.preferencesWindow?.unmaximize() : this.window.unmaximize(),
			// Temporary fix
			"close": (_: Event, [window]: string[]) => window === "preferences" ? this.preferencesWindow?.close() : this.window.close(),

			"read-file": (_: Event, [path]: string[]) => fs.promises.readFile(path),
			
			"open-file-dialog": async () => {
				const response = await dialog.showOpenDialog({
					properties: ["openFile"],
					filters: [
						{ name: "Audio", extensions: ALLOWED_EXTENSIONS },
					],
				});

				if (!response.canceled)
					this.playAudio(response.filePaths[0]);
			},

			"open-folder-dialog": async () => {
				const response = await dialog.showOpenDialog({
					properties: ["openDirectory"],
				});

				if (!response.canceled)
					this.window.webContents.send("play-folder", await loadFolder(response.filePaths[0]));
			},

			"get-cover": async (_: Event, [path]: string[]) => this.getResizedCover(path),

			"get-cover-pixelized": async (_: Event, [path]: string[]) => {
				const coverBuffer = await this.getCover(path);

				if (!coverBuffer)
					return;

				return (await sharp(await sharp(coverBuffer).resize(128, 128, {
					kernel: "nearest",
				}).png().toBuffer()).resize(256, 256, {
					kernel: "nearest",
				}).png().toBuffer()).toString("base64");
			},
			"get-metadata": (_: Event, [path]: string[]) => path && mm.parseBuffer(fs.readFileSync(path)),

			"show-item": (_: Event, [fullPath]: string[]) => shell.showItemInFolder(path.normalize(fullPath)),

			"drop-file": async (_: Event, [paths]: string[][]) => {
				paths.forEach(async (path) => {
					if (fs.lstatSync(path).isDirectory())
						this.window.webContents.send("load-folder", await loadFolder(path));
					else
						this.playAudio(path);
				});
			},

			"sync-window-state": () => ({  
				isMinimized: this.window.isMinimized(),
				isMaximized: this.window.isMaximized(),
			}),

			"update-rich-presence": (_: Event, [  
				title, 
				duration,
				seek,
				status,
			]: string[]) => this.discord.updateCurrentSong(title, duration, seek, status === "true"),

			"open-preferences": () => {
				this.preferencesWindow = new BrowserWindow({	...this.windowOptions, show: true, width: 600, height: 800 });
					this.preferencesWindow.loadURL( resolveHTMLPath("index") + "/#preferences");
					this.preferencesWindow.once('ready-to-show', () => {
						this.preferencesWindow!.show();
					})
				},
			"check-for-updates": () => {
				if (IS_DEV)
					return;

				checkForUpdatesAndInstall();
			}
		}).forEach(([channel, handler]) => ipcMain.handle(channel, handler));
	}

	private async getCover(path: string): Promise<Buffer | undefined> {
		return (await mm.parseBuffer(fs.readFileSync(path))).common.picture?.[0].data;
	}

	private async getResizedCover(path: string, resizeTo = 12): Promise<string | undefined> {
		const cover = await this.getCover(path);

		if (!cover)
			return;

		return (
			await sharp(cover).resize(resizeTo, resizeTo).png().toBuffer()
		).toString("base64");
	}
}

export async function checkForUpdatesAndInstall() {
	return import("electron-updater")
		.then(({ autoUpdater }) => {
			autoUpdater.checkForUpdatesAndNotify({
				title: "Update Installing",
				body: "The application will restart once the update is complete.",
			});
			autoUpdater.on("update-downloaded", () => autoUpdater.quitAndInstall(true, true));
		})
		.catch(e => console.error("Failed check updates:", e));
}