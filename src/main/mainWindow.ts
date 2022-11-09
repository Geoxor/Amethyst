import { BrowserWindow, dialog, Event, ipcMain, Notification, shell } from "electron";
import log from "electron-log";
import { autoUpdater } from "electron-updater";
import { FastAverageColorResult } from "fast-average-color";
import { getAverageColor } from "fast-average-color-node";
import fs from "fs";
import open from "open";
import path from "path";
import sharp from "sharp";
import { Discord } from "./discord";
import { loadFolder } from "./handles";
import { ALLOWED_EXTENSIONS, APP_VERSION, IS_DEV, RESOURCES_PATH } from "./main";
import { Metadata } from "./metadata";
import { resolveHTMLPath } from "./util";

const icon = () => path.join(RESOURCES_PATH, "icon.png");

const notifications = {
	showUpdateInstallingNotification: () => {
		const title = "Update Installing";
		const body = "The application will restart once the update is complete.";
		new Notification({
			icon: icon(),
			title,
			body,
		}).show();
	},

	showUpdateAvailableNotification: () => {
		const title = "Amethyst Update Available";
		const body = "Amethyst is downloading an update and will restart when complete";
		new Notification({
			icon: icon(),
			title,
			body
		}).show();
	},
};

export class MainWindow {
	public readonly window: BrowserWindow;
	public updateCheckerTimer: NodeJS.Timer | undefined;

	private readonly windowOptions: Electron.BrowserWindowConstructorOptions = {
		show: false,
		width: 1280,
		height: 720,
		minHeight: 500,
		minWidth: 800,
		icon: icon(),
		frame: false,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			webSecurity: false,
		},
	};

	private readonly discord: Discord;

	constructor() {
		this.window = new BrowserWindow(this.windowOptions);
		this.discord = new Discord();
		// eslint-disable-next-line no-console
		console.log(`
    ___                   __  __               __ 
   /   |  ____ ___  ___  / /_/ /_  __  _______/ /_
  / /| | / __ \`__ \\/ _ \\/ __/ __ \\/ / / / ___/ __/
 / ___ |/ / / / / /  __/ /_/ / / / /_/ (__  ) /_  
/_/  |_/_/ /_/ /_/\\___/\\__/_/ /_/\\__, /____/\\__/  
 v${APP_VERSION}                        /____/            
		`);

		this.setIpcEvents();
		this.setWindowEvents();
	}

  public async getCover(path: string): Promise<Buffer | undefined> {
		const meta = await Metadata.getMetadata(path);
		return meta?.common.picture?.[0].data;
	}

	public async getResizedCover(path: string, resizeTo = 64): Promise<string | undefined> {
		const cover = await this.getCover(path);

		if (!cover)
			return;

		return (
			await sharp(cover).resize(resizeTo, resizeTo).webp().toBuffer()
		).toString("base64");
	}

	public show(): void {
		this.window.loadURL(resolveHTMLPath("index"));

		this.window.on("ready-to-show", () => {

			// Autoupdates
			// Remove this if your app does not use auto updates
			log.transports.file.level = "info";
			autoUpdater.logger = log;
			autoUpdater.checkForUpdatesAndNotify();

			// Check for updates every 10 minutes
			this.updateCheckerTimer && clearInterval(this.updateCheckerTimer);
			this.updateCheckerTimer = setInterval(() => autoUpdater.checkForUpdatesAndNotify(), 600 * 1000);

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
		this.window.on("unmaximize", () => this.window.webContents.send("unmaximize"));
		this.window.on("maximize", () => this.window.webContents.send("maximize"));
		this.window.on("focus", () => this.window.webContents.send("focus"));
		this.window.on("blur", () => this.window.webContents.send("unfocus"));
		this.window.on("closed", () => this.destroy());

		autoUpdater.on("update-downloaded", () => this.window.webContents.send("update"));

		this.window.webContents.on("dom-ready", async () => {
			if (process.argv[1])
				this.playAudio(process.argv[1]);

			this.window.webContents.send("default-cover", await fs.promises.readFile(
				path.join(RESOURCES_PATH, "/images/default-cover.png"),
			));
			this.window.webContents.send(
				"version",
				APP_VERSION + (IS_DEV ? " DEV-BUILD" : ""),
			);
			this.window.webContents.send("acceptable-extensions", ALLOWED_EXTENSIONS);
		});
		// Open urls in the user's browser
		this.window.webContents.setWindowOpenHandler(data => {
			shell.openExternal(data.url);

			return { action: "deny" };
		});
	}

	private setIpcEvents(): void {

		Object.entries({
			"test-notification": (_: Event, [notification]: string) => (notifications as { [key: string]: any })[notification](),
			"minimize": () => this.window.minimize(),
			"maximize": () => this.window.maximize(),
			"unmaximize": () => this.window.unmaximize(),
			"close": () => this.window.close(),
			"read-file": (_: Event, [path]: string[]) => {
				return fs.promises.readFile(path);
			},
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

			"open-external": (_: Event, [path]: string[]) => {
				open(path);
			},

			"open-folder-dialog": async () => {
				const response = await dialog.showOpenDialog({
					properties: ["openDirectory"],
				});

				if (!response.canceled)
					this.window.webContents.send("play-folder", await loadFolder(response.filePaths[0]));
			},

			"percent-cpu-usage": async () => {
				return process.getCPUUsage().percentCPUUsage;
			},

			"get-cover": async (_: Event, [path]: string[]) => {
				return this.getResizedCover(path);
			},

			"get-cover-colors": async (_: Event, [path]: string[]): Promise<FastAverageColorResult> => {
				const coverBuffer = await this.getCover(path);
				if (!coverBuffer)
					return Promise.reject();

				try {
					const color = await getAverageColor(coverBuffer);
					return color;
				} catch (error) {
					return Promise.reject(error);
				}
			},

			"get-metadata": async (_: Event, [path]: string[]) => {
				return Metadata.getMetadata(path);
			},

			"show-item": (_: Event, [fullPath]: string[]) => {
				shell.showItemInFolder(path.normalize(fullPath));
			},

			"drop-file": async (_: Event, [paths]: string[][]) => {
				paths.forEach(async path => {
					const stat = await fs.promises.stat(path);
					if (stat.isDirectory())
						this.window.webContents.send("load-folder", await loadFolder(path));
					else
						this.playAudio(path);
				});
			},

			"sync-window-state": () => {
				return {
					isMinimized: this.window.isMinimized(),
					isMaximized: this.window.isMaximized(),
				};
			},

			"update-rich-presence": (_: Event, [
				title,
				duration,
				seek,
				status,
			]: string[]) => {
				this.discord.updateCurrentSong(title, duration, seek, status === "true");
			},

			"check-for-updates": () => {
				checkForUpdatesAndInstall();
			}
		}).forEach(([channel, handler]) => ipcMain.handle(channel, handler));
	}
}

export async function checkForUpdatesAndInstall() {
	autoUpdater.checkForUpdatesAndNotify();
}