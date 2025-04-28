/* eslint-disable no-console */
import fs from "fs";
import os from "os";
import path from "path";
import type { Event} from "electron";
import electron, { app, BrowserWindow, dialog, ipcMain, Notification, shell } from "electron";
import type { FormatIcons } from "./discord";
import { Discord } from "./discord";
import {ALLOWED_AUDIO_EXTENSIONS} from "../shared/constants";
import {sleep} from "../shared/logic";
import { IS_DEV, store } from "./main";
import windowStateKeeper from "electron-window-state";
import type { FSWatcher } from "chokidar";
import chokidar from "chokidar";
import chalk from "chalk";

export const APP_VERSION = app.isPackaged ? app.getVersion() : process.env.npm_package_version ?? "0.0.0";
export const METADATA_CACHE_PATH = path.join(app.getPath("appData"), "/amethyst/Metadata Cache");
export const TOTAL_CORES = os.cpus().length;
export const RESOURCES_PATH = path.join(__dirname, "../".repeat(+app.isPackaged * 2 + 2), "assets");

try {
	console.log(fs.statSync(METADATA_CACHE_PATH));
} catch (e) {
	fs.promises.mkdir(METADATA_CACHE_PATH, {recursive: true});
	console.log(`Created metadata cache folder at ${METADATA_CACHE_PATH}`);
}

export const icon = () => path.join(RESOURCES_PATH, "icon.png");
export const checkForUpdatesAndInstall = async () => {
	const autoUpdatesEnabled = store.get("autoUpdatesEnabled", true);
	if (!autoUpdatesEnabled) return;
	if (IS_DEV) return await sleep(2000);
	const { autoUpdater } = await import("electron-updater");
	autoUpdater.autoInstallOnAppQuit = false;
	await autoUpdater.checkForUpdatesAndNotify();
	return;
};

const LOGO = `
    ___                   __  __               __ 
   /   |  ____ ___  ___  / /_/ /_  __  _______/ /_
  / /| | / __ \`__ \\/ _ \\/ __/ __ \\/ / / / ___/ __/
 / ___ |/ / / / / /  __/ /_/ / / / /_/ (__  ) /_  
/_/  |_/_/ /_/ /_/\\___/\\__/_/ /_/\\__, /____/\\__/  
 v${APP_VERSION}                         /____/            
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
	public updateCheckerTimer: NodeJS.Timeout | undefined;
	private windowState = windowStateKeeper({
		defaultWidth: 1280,
		defaultHeight: 720,
	});
	private readonly discord: Discord;

	public watchers: Record<string, FSWatcher> = {};

	constructor() {

		this.window = new BrowserWindow({
			titleBarStyle: "hidden",
			show: false,
			x: this.windowState.x,
			y: this.windowState.y,
			width: this.windowState.width,
			height: this.windowState.height,
			minHeight: 600,
			minWidth: 960,
			icon: icon(),
			frame: false,
			webPreferences: {
				preload: path.join(__dirname, "preload.js"),
				webSecurity: false,
				nodeIntegration: true,
			},
		});

		this.windowState.manage(this.window);

		this.discord = new Discord();
	
		// Let us register listeners on the window, so we can update the state
		// automatically (the listeners will be removed when the window is closed)
		// and restore the maximized or full screen state

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
        const url = new URL(`http://localhost:${6969}`);
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

					// Check for updates every 1 hour
					this.updateCheckerTimer && clearInterval(this.updateCheckerTimer);
					this.updateCheckerTimer = setInterval(() => autoUpdater.checkForUpdatesAndNotify(), 3600 * 1000);

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
				this.playAudio(path.join(process.argv[1]));

			// this.window.webContents.send("default-cover", await fs.promises.readFile(
			// 	path.join(RESOURCES_PATH, "/images/audio.png"),
			// ));
			this.window.webContents.send(
				"version",
				APP_VERSION + (IS_DEV ? " dev" : ""),
			);
			this.window.webContents.send("acceptable-extensions", ALLOWED_AUDIO_EXTENSIONS);
		});
		// Open urls in the user's browser
		this.window.webContents.setWindowOpenHandler(data => {
			shell.openExternal(data.url);

			return { action: "deny" };
		});
	}

	private async loadFolder (
		inputPath: string,
		filters: Electron.FileFilter[]
	): Promise<string[]> {
		const result: string[] = [];
	
		function recurse(currentPath: string): void {
			const files = fs.readdirSync(currentPath);
	
			files.forEach(file => {
				const filePath = path.join(currentPath, file);
				const stat = fs.statSync(filePath);
	
				if (stat.isDirectory()) {
					recurse(filePath); // Recurse into subdirectories
				} else {
					// Check if the file matches any of the specified filters
					if (
						filters.some(filter =>
							filter.extensions.some(ext => file.endsWith(`.${ext}`))
						)
					) {
						result.push(filePath);
					}
				}
			});
		}
	
		recurse(inputPath);
		return result;
	}

	private setIpcEvents(): void {

		Object.entries({
			"test-notification": (_: Event, [notification]: string) => (notifications)[notification](),
			"minimize": () => this.window.minimize(),
			"maximize": () => this.window.maximize(),
			"unmaximize": () => this.window.unmaximize(),
			"close": () => this.window.close(),
			"fullscreen": () => this.window.setFullScreen(!this.window.isFullScreen()),
			"read-file": (_: Event, [path]: string[]) => {
				return fs.promises.readFile(path);
			},
			"get-appdata-path": () => app.getPath("appData"),
			"open-file-dialog": async (_: Event, [options]: [Electron.OpenDialogOptions]) => {
				return dialog.showOpenDialog({
					properties: ["openFile"],
					filters: options.filters
				});
			},

			"open-folder-dialog": async () => {
				return dialog.showOpenDialog({
					properties: ["openDirectory"],
				});
				// return {canceled: false, filePaths: await this.loadFolder(result.filePaths[0], filter) };
			},

			"get-app-metrics": async () => {
				return app.getAppMetrics();
			},
			
			"fetch-folder-content": async (_: Event, [path, filter]: [string, Electron.FileFilter[]]) => {
				return this.loadFolder(path, filter);
			},

			"open-external": async (_: Event, [path]: string[]) => {
				import("open").then(({ default: open }) => open(path));
			},

			"show-save-dialog": (_: Event, [options]: [Electron.SaveDialogOptions]) => dialog.showSaveDialog(options),
			
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

			"sync-window-state": () => {
				return {
					isMinimized: this.window.isMinimized(),
					isMaximized: this.window.isMaximized(),
				};
			},

			"update-rich-presence": (_: Event, [args]: string[]) => {
				const [title, time, format] = args;

				this.discord.updateCurrentSong(title, time, format as FormatIcons);
			},

			"set-vsync": (_: Event, [useVsync]: string[]) => {
				store.set("useVsync", useVsync);
				console.log(`Set store 'frameRateLimit' to ${useVsync}`);
				app.relaunch();
				app.exit();
			},

			"set-autostart": (_: Event, [autoStart]: [boolean]) => {
				store.set("autoStart", autoStart);
				console.log(`Set store 'autoStart' to ${autoStart}`);
				electron.app.setLoginItemSettings({
					openAtLogin: autoStart,
					path: electron.app.getPath("exe")
				});
			},

			"set-autoupdates": (_: Event, [autoUpdatesEnabled]: string[]) => {
				store.set("autoUpdatesEnabled", autoUpdatesEnabled);
				console.log(`Set store 'autoUpdatesEnabled' to ${autoUpdatesEnabled}`);
			},

			"clear-rich-presence": () => {
				this.discord.clearRichPresence();
			},

			"check-for-updates": () => {
				return checkForUpdatesAndInstall();
			},

			"watch-folder": async (_: Event, [path, uuid]: [string, string]) => {
				const watcher = chokidar.watch(path, {
					persistent: true,
					ignoreInitial: true,
					ignored: (path, stats) => 
						stats?.isFile() && !ALLOWED_AUDIO_EXTENSIONS.some(allowedExt => path.endsWith(allowedExt)) || false
				});

				this.watchers[uuid] = watcher;
				console.log("Watching media source folder:", chalk.blue(path), chalk.yellow(uuid));
				
				const frontend = this.window.webContents;

				watcher
					.on("add", path => frontend.send("watch:add", [path, uuid]))
					.on("change", path => frontend.send("watch:change", [path, uuid]))
					.on("unlink", path => frontend.send("watch:unlink", [path, uuid]));
			},

			"unwatch-folder": async (_: Event, [path, uuid]: [string, string]) => {
				const watcher = this.watchers[uuid];
				if (!watcher) return;
				watcher.close();
				console.log("Stopped watching media source folder:", chalk.yellow(path));
			},

		}).forEach(([channel, handler]) => ipcMain.handle(channel, handler));
	}
}
