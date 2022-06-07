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
import { app } from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";

import { MainWindow } from "./mainWindow";

export const IS_DEBUG = process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";
export const RESOURCES_PATH = path.join(__dirname, "../".repeat(+app.isPackaged * 2 + 2), "assets");
export const ALLOWED_EXTENSIONS = ["ogg", "flac", "wav", "opus", "aac", "aiff", "mp3", "m4a"];
export const APP_VERSION = app.isPackaged ? app.getVersion() : process.env.npm_package_version ?? "0.0.0";

if (process.env.NODE_ENV === "production")
	import("source-map-support").then(smc => smc.install());

// if (isDebug)
// import("electron-debug").then(electronDebug => electronDebug ());

if (!app.requestSingleInstanceLock()) {
	app.quit();
	process.exit(0);
}
else {
	app.whenReady().then(() => {
		const mainWindow = new MainWindow();

		// Autoupdates
		// Remove this if your app does not use auto updates
		log.transports.file.level = "info";
		autoUpdater.logger = log;

		app.on("window-all-closed", () => {
			console.log("close");
			// Respect the OSX convention of having the application in memory even
			// after all windows have been closed
			if (process.platform !== "darwin")
				app.quit();
		});

		app.on("second-instance", (_event, argv) => {
			console.log("second");
			// Someone tried to run a second instance, we should focus our window.
			if (mainWindow.window.isMinimized())
				mainWindow.window.restore();

			mainWindow.playAudio(argv[2]);
			mainWindow.window.focus();
		});

		if (IS_DEBUG) {
			import("electron-devtools-installer").then(({
				default: installExtension,
				VUEJS3_DEVTOOLS,
			}) => installExtension(VUEJS3_DEVTOOLS, {
				loadExtensionOptions: {
					allowFileAccess: true,
				},
			})).catch(error => console.error("Failed install extension:", error));
		}

		mainWindow.show();

		if (app.isPackaged)
			autoUpdater.checkForUpdatesAndNotify();
	}).catch(console.error);
}

