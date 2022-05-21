/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from "path";
import fs from "fs";
import { BrowserWindow, app, dialog, ipcMain, shell } from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import { resolveHtmlPath } from "./util";
import "./handles";
import Discord from "./discord";

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, "assets")
  : path.join(__dirname, "../../assets");

const DEFAULT_COVER = fs.readFileSync(`${RESOURCES_PATH}/images/default-cover.png`);

let mainWindow: BrowserWindow | null = null;

const discord = new Discord();

if (process.env.NODE_ENV === "production")
	import("source-map-support").then(smc => smc.install());

const isDebug
  = process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

// if (isDebug)
// import("electron-debug").then(electronDebug => electronDebug ());

const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
	app.quit();
	process.exit(0);
}

const playAudio = (path: string) => mainWindow!.webContents.send("play-file", path);

app.on("second-instance", (_event, argv) => {
	// Someone tried to run a second instance, we should focus our window.
	if (mainWindow) {
		if (mainWindow.isMinimized())
			mainWindow.restore();
		playAudio(argv[2]);
		mainWindow.focus();
	}
});

const installExtensions = async () => {
	import("electron-devtools-installer")
		.then(({ default: installExtension, VUEJS3_DEVTOOLS }) =>
			installExtension(VUEJS3_DEVTOOLS, {
				loadExtensionOptions: {
					allowFileAccess: true,
				},
			}),
		)
		.catch(e => console.error("Failed install extension:", e));
};

const createWindow = async () => {
	if (isDebug)
		await installExtensions();

	const getAssetPath = (...paths: string[]): string => {
		return path.join(RESOURCES_PATH, ...paths);
	};

	mainWindow = new BrowserWindow({
		show: false,
		width: 1024,
		height: 728,
		icon: getAssetPath("icon.png"),
		frame: false,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			webSecurity: false,
		},
	});

	mainWindow.loadURL(resolveHtmlPath("index.html"));

	mainWindow.on("ready-to-show", () => {
		if (!mainWindow)
			throw new Error("\"mainWindow\" is not defined");

		if (process.env.START_MINIMIZED)
			mainWindow.minimize();

		else
			mainWindow.show();

		if (isDebug)
			mainWindow?.webContents.openDevTools();
	});

	mainWindow.on("closed", () => {
		mainWindow = null;
	});

	mainWindow.on("unmaximize", () => mainWindow!.webContents.send("unmaximize"));
	mainWindow.on("maximize", () => mainWindow!.webContents.send("maximize"));

	mainWindow.webContents.on("dom-ready", () => {
		playAudio(process.argv[1] || "No file opened");
		mainWindow!.webContents.send("default-cover", DEFAULT_COVER);
	});

	// Open urls in the user's browser
	mainWindow.webContents.setWindowOpenHandler((edata) => {
		shell.openExternal(edata.url);
		return { action: "deny" };
	});

	// Autoupdates
	// Remove this if your app does not use auto updates
	log.transports.file.level = "info";
	autoUpdater.logger = log;
	autoUpdater.checkForUpdatesAndNotify();
};

/**
 * Add event listeners...
 */
app.on("window-all-closed", () => {
	// Respect the OSX convention of having the application in memory even
	// after all windows have been closed
	if (process.platform !== "darwin")
		app.quit();
});

app
	.whenReady()
	.then(() => {
		createWindow();
		app.on("activate", () => {
			// On macOS it's common to re-create a window in the app when the
			// dock icon is clicked and there are no other windows open.
			if (mainWindow === null)
				createWindow();
		});
	})
	.catch(console.log);

async function openFile() {
	const response = await dialog.showOpenDialog({
		properties: ["openFile"],
		filters: [
			{ name: "Audio", extensions: ["ogg", "flac", "wav", "opus", "aac", "aiff", "mp3", "m4a"] },
		],
	});
	!response.canceled && playAudio(response.filePaths[0]);
}

ipcMain.handle("minimize", () => mainWindow?.minimize());
ipcMain.handle("maximize", () => mainWindow?.maximize());
ipcMain.handle("unmaximize", () => mainWindow?.unmaximize());
ipcMain.handle("close", () => mainWindow?.close());
ipcMain.handle("open-file-dialog", async () => openFile());
ipcMain.handle("show-item", (_, [fullPath]) => shell.showItemInFolder(path.normalize(fullPath)));
ipcMain.handle("update-rich-presence", (_, [title, duration, seek, status]) => discord.updateCurrentSong(title, duration, seek, status));
ipcMain.handle("sync-window-state", () => ({
	isMinimized: mainWindow?.isMinimized(),
	isMaximized: mainWindow?.isMaximized(),
}));
