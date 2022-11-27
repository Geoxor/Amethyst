/* eslint-disable no-console */
const start = performance.now();
import { app, BrowserWindow, dialog, Event, ipcMain, Notification, shell } from "electron";
import fs from "fs";
import os from "os";
import path from "path";
import { Discord, FormatIcons } from "./discord";
import { ALLOWED_EXTENSIONS, APP_VERSION, IS_DEV, RESOURCES_PATH } from "./main";
import { resolveHTMLPath } from "./util";

const icon = () => path.join(RESOURCES_PATH, "icon.png");

fs.promises.mkdir(path.join(app.getPath("appData"), "/amethyst/Metadata Cache"));

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
			nodeIntegration: true,
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
		const { Metadata } = await import("./metadata");
		const meta = await Metadata.getMetadata(path);
		return meta?.common.picture?.[0].data;
	}

	public async getResizedCover(path: string, resizeTo = 128): Promise<string | undefined> {
		const cover = await this.getCover(path);

		if (!cover)
			return;

		const sharp = (await import("sharp")).default;

		return (
			await sharp(cover).resize(resizeTo, resizeTo).webp().toBuffer()
		).toString("base64");
	}

	public show(): void {
		this.window.loadURL(resolveHTMLPath("index"));

		this.window.on("ready-to-show", () => {
			console.log(`Startup took: ${(performance.now() - start).toFixed(2)}ms`);
			
			import("electron-updater").then(({ autoUpdater }) => {
				import("electron-log").then(log => {
					// Autoupdates
					// Remove this if your app does not use auto updates
					log.transports.file.level = "info";
					autoUpdater.logger = log;
					autoUpdater.checkForUpdatesAndNotify();

					// Check for updates every 10 minutes
					this.updateCheckerTimer && clearInterval(this.updateCheckerTimer);
					this.updateCheckerTimer = setInterval(() => autoUpdater.checkForUpdatesAndNotify(), 600 * 1000);

					autoUpdater.on("update-downloaded", () => this.window.webContents.send("update"));
				});
			});

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

		this.window.webContents.on("dom-ready", async () => {
			if (process.argv[1])
				this.playAudio(process.argv[1]);

			this.window.webContents.send("default-cover", await fs.promises.readFile(
				path.join(RESOURCES_PATH, "/images/audio.png"),
			));
			this.window.webContents.send(
				"version",
				APP_VERSION + (IS_DEV ? " dev" : ""),
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
			"get-appdata-path": () => app.getPath("appData"),
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

			"open-external": async (_: Event, [path]: string[]) => {
				(await import("open")).default(path);
			},

			"open-folder-dialog": async () => {
				const response = await dialog.showOpenDialog({
					properties: ["openDirectory"],
				});

				if (!response.canceled) {
					const { loadFolder } = await import ("./handles");
					this.window.webContents.send("play-folder", await loadFolder(response.filePaths[0]));
				}
			},

			"show-save-dialog": () => dialog.showSaveDialog({filters: [
				{ name: "Amethyst Node Table", extensions: ["ant"] },
			]}),
			
			"dev-tools": () => {
				this.window.webContents.openDevTools();
			},

			"percent-cpu-usage": async () => {
				const pidusage = (await import("pidusage")).default;
				const windowStats = await pidusage(this.window.webContents.getOSProcessId());

				return {

					node: process.getCPUUsage().percentCPUUsage,
					renderer: windowStats.cpu / os.cpus().length
				};
			},

			"get-cover": async (_: Event, [path]: string[]) => {
				return this.getResizedCover(path);
			},

			"get-metadata": async (_: Event, [path]: string[]) => {
				const { Metadata } = await import("./metadata");
				return Metadata.getMetadata(path);
			},

			"show-item": (_: Event, [fullPath]: string[]) => {
				shell.showItemInFolder(path.normalize(fullPath));
			},

			"drop-file": async (_: Event, [paths]: string[][]) => {
				const { loadFolder } = await import ("./handles");
				paths.forEach(async path => {
					const stat = await fs.promises.stat(path);
					if (stat.isDirectory()) {
						this.window.webContents.send("load-folder", await loadFolder(path));
					}
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

			"update-rich-presence": (_: Event, [args]: string[]) => {
				const [title, duration, seek, format] = args;

				this.discord.updateCurrentSong(title, duration, seek, format as FormatIcons);
			},

			"clear-rich-presence": () => {
				this.discord.clearRichPresence();
			},

			"check-for-updates": () => {
				checkForUpdatesAndInstall();
			}
		}).forEach(([channel, handler]) => ipcMain.handle(channel, handler));
	}
}

export async function checkForUpdatesAndInstall() {
	import("electron-updater").then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify());
}