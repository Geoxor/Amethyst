/* eslint-disable no-console */
import fs from "fs";
import os from "os";
import path from "path";
import { app, BrowserWindow, dialog, Event, ipcMain, Notification, shell } from "electron";
import { Discord, FormatIcons } from "../../plugins/amethyst.discord";
import { IS_DEV } from "./main";
import packageJson from "../../package.json";

export const APP_VERSION = app.isPackaged ? app.getVersion() : process.env.npm_package_version ?? "0.0.0";
export const METADATA_CACHE_PATH = path.join(app.getPath("appData"), "/amethyst/Metadata Cache");
export const TOTAL_CORES = os.cpus().length;
export const RESOURCES_PATH = path.join(__dirname, "../".repeat(+app.isPackaged * 2 + 2), "assets");
export const ALLOWED_EXTENSIONS = packageJson.build.fileAssociations.map(association => association.ext);

fs.statSync(METADATA_CACHE_PATH) || fs.promises.mkdir(METADATA_CACHE_PATH);

export const icon = () => path.join(RESOURCES_PATH, "icon.png");
export const checkForUpdatesAndInstall = () => {
	!IS_DEV && import("electron-updater").then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify());
};

const LOGO = `
    ___                   __  __               __ 
   /   |  ____ ___  ___  / /_/ /_  __  _______/ /_
  / /| | / __ \`__ \\/ _ \\/ __/ __ \\/ / / / ___/ __/
 / ___ |/ / / / / /  __/ /_/ / / / /_/ (__  ) /_  
/_/  |_/_/ /_/ /_/\\___/\\__/_/ /_/\\__, /____/\\__/  
 v${APP_VERSION}                        /____/            
		`;

import("chalk").then(({default: chalk}) => console.log(chalk.hex("868aff")(LOGO)));

const notifications: Record<string, Function> = {
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

		const {default: sharp} = await import("sharp");

		return (
			await sharp(cover).resize(resizeTo, resizeTo).webp().toBuffer()
		).toString("base64");
	}

	private resolveHTMLPath(htmlFileName: string) {
    if (process.env.NODE_ENV === "development") {
        const url = new URL(`http://localhost:${1337}`);
				url.pathname = htmlFileName;
        return url.href;
    }
    else {
        return `file://${path.resolve(__dirname, "../renderer/", htmlFileName + ".html")}`;
    }
}

	public show(): void {
		this.window.loadURL(this.resolveHTMLPath("index"));

		this.window.on("ready-to-show", () => {
			!IS_DEV && import("electron-updater").then(({ autoUpdater }) => {
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

	private async loadFolder(inputPath: string) {
		return new Promise((resolve, reject) => {
			fs.readdir(inputPath, (error, files) => {
				if (error) {
					reject(error);
				}
				else {
					Promise.all(
						files.map(async file => {
							const filePath = path.join(inputPath, file);
							const stats = await fs.promises.stat(filePath);
							if (stats.isDirectory())
								return this.loadFolder(filePath);
							else if (stats.isFile() && ALLOWED_EXTENSIONS.includes(path.extname(filePath).slice(1)))
								return filePath;
						}),
					).then(files => resolve(files.filter(file => !!file)));
				}
			});
		});
	}

	private setIpcEvents(): void {

		Object.entries({
			"test-notification": (_: Event, [notification]: string) => (notifications)[notification](),
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
					this.window.webContents.send("play-folder", await this.loadFolder(response.filePaths[0]));
				}
			},

			"show-save-dialog": () => dialog.showSaveDialog({filters: [
				{ name: "Amethyst Node Table", extensions: ["ant"] },
			]}),
			
			"dev-tools": () => {
				this.window.webContents.openDevTools();
			},

			"percent-cpu-usage": async () => {
				const {default: pidusage} = await import("pidusage");
				const windowStats = await pidusage(this.window.webContents.getOSProcessId());

				return {

					node: process.getCPUUsage().percentCPUUsage,
					renderer: windowStats.cpu / TOTAL_CORES
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
				paths.forEach(async path => {
					const stat = await fs.promises.stat(path);
					if (stat.isDirectory()) {
						this.window.webContents.send("load-folder", await this.loadFolder(path));
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
