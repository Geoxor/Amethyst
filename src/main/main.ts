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
import * as mm from "music-metadata/lib/core";
import sharp from "sharp";
import { resolveHtmlPath } from "./util";
import { ALLOWED_EXTENSIONS, loadFolder } from "./handles";
import Discord from "./discord";

const getDevVersion = () => JSON.parse(fs.readFileSync(path.join(__dirname, "../../package.json"), "utf8")).version;

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
		icon: isDebug ? getAssetPath("icon-dev.png") : getAssetPath("icon.png"),
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

		// if (isDebug)
			// mainWindow?.webContents.openDevTools();
	});

	mainWindow.on("closed", () => {
		mainWindow = null;
	});

	mainWindow.on("unmaximize", () => mainWindow!.webContents.send("unmaximize"));
	mainWindow.on("maximize", () => mainWindow!.webContents.send("maximize"));

	mainWindow.webContents.on("dom-ready", () => {
		playAudio(process.argv[1] || "No file opened");
		mainWindow!.webContents.send("default-cover", DEFAULT_COVER);
		mainWindow!.webContents.send("version", isDebug ? `${getDevVersion()} DEV-BUILD` : app.getVersion());
		mainWindow!.webContents.send("acceptable-extensions", ALLOWED_EXTENSIONS);
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

async function openFolder() {
	const response = await dialog.showOpenDialog({
		properties: ["openDirectory"],
	});

	if (response.canceled)
		return;
	const folder = await loadFolder(response.filePaths[0]);
	mainWindow!.webContents.send("play-folder", folder);
}

async function getCover(path: string) {
	const file = await fs.promises.readFile(path);
	const meta = await mm.parseBuffer(file);
	const cover = meta.common?.picture?.[0].data;
	return cover;
}

async function getCoverPixelized(path: string) {
	const coverBuffer = await getCover(path);
	if (!coverBuffer)
		return;

	const downscaled = await sharp(coverBuffer).resize(128, 128, { kernel: "nearest" }).png().toBuffer();
	const stretched = await sharp(downscaled).resize(256, 256, { kernel: "nearest" }).png().toBuffer();

	return stretched.toString("base64");
}

async function getCoverDownscaled(path: string, resizeTo = 12) {
	const cover = await getCover(path);
	if (!cover)
		return;
	return (await sharp(cover).resize(resizeTo, resizeTo).png().toBuffer()).toString("base64");
}

ipcMain.handle("minimize", () => mainWindow!.minimize());
ipcMain.handle("maximize", () => mainWindow!.maximize());
ipcMain.handle("unmaximize", () => mainWindow!.unmaximize());
ipcMain.handle("close", () => mainWindow!.close());
ipcMain.handle("open-file-dialog", () => openFile());
ipcMain.handle("open-folder-dialog", () => openFolder());
ipcMain.handle("get-cover-pixelized", (_, [path]) => getCoverPixelized(path));
ipcMain.handle("get-cover", (_, [path]) => getCoverDownscaled(path));
ipcMain.handle("get-metadata", async (_, [path]) => path && mm.parseBuffer(await fs.promises.readFile(path)));
ipcMain.handle("show-item", (_, [fullPath]) => shell.showItemInFolder(path.normalize(fullPath)));
ipcMain.handle("update-rich-presence", (_, [title, duration, seek, status]) => discord.updateCurrentSong(title, duration, seek, status));
ipcMain.handle("sync-window-state", () => ({
	isMinimized: mainWindow!.isMinimized(),
	isMaximized: mainWindow!.isMaximized(),
}));

