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
import { BrowserWindow, app, shell } from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import { resolveHtmlPath } from "./util";
import "./handles";

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === "production")
	import("source-map-support").then(smc => smc.install());

const isDebug
  = process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

if (isDebug)
	import("electron-debug").then(electronDebug => electronDebug());

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

	const RESOURCES_PATH = app.isPackaged
		? path.join(process.resourcesPath, "assets")
		: path.join(__dirname, "../../assets");

	const getAssetPath = (...paths: string[]): string => {
		return path.join(RESOURCES_PATH, ...paths);
	};

	mainWindow = new BrowserWindow({
		show: false,
		width: 1024,
		height: 728,
		icon: getAssetPath("icon.png"),
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
	});

	mainWindow.on("closed", () => {
		mainWindow = null;
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
