/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { app } from "electron";
import { checkForUpdatesAndInstall, MainWindow } from "./mainWindow";
import Store from "electron-store";
export const store = new Store();

export const IS_DEV = process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";
if (process.env.NODE_ENV === "production")
	import("source-map-support").then(smc => smc.install());

// if (isDebug) 
// import("electron-debug").then(electronDebug => electronDebug ());

app.setAppUserModelId("Amethyst");
app.commandLine.appendSwitch("js-flags", "--max-old-space-size=1536");

if (!app.requestSingleInstanceLock()) {
	app.quit();
	process.exit(0);
}
else {
	app.whenReady()
		.then(() => {
			const useVsync = store.get("useVsync", true);
			if (useVsync) {
				app.commandLine.removeSwitch("disable-frame-rate-limit");
				console.log("Vsync enabled");
			} else {
				app.commandLine.appendSwitch("disable-frame-rate-limit");
				console.log("Vsync disabled");
			}

			const mainWindow = new MainWindow();

			app.on("window-all-closed", () => {
				// Respect the OSX convention of having the application in memory even
				// after all windows have been closed
				if (process.platform !== "darwin")
					app.quit();
			});

			app.on("second-instance", (_event, argv) => {
				// Someone tried to run a second instance, we should focus our window.
				if (mainWindow.window.isMinimized())
					mainWindow.window.restore();

				mainWindow.playAudio(argv[2]);
				mainWindow.window.focus();
			});

			// if (IS_DEV) {
			// 	import("electron-devtools-installer").then(({
			// 		default: installExtension,
			// 		VUEJS3_DEVTOOLS,
			// 	}) => installExtension(VUEJS3_DEVTOOLS, {
			// 		loadExtensionOptions: {
			// 			allowFileAccess: true,
			// 		},
			// 	})).catch(error => console.error("Failed install extension:", error));
			// }

			mainWindow.show();

		}).catch();
}

if (!IS_DEV) {
	app
		.whenReady()
		.then(checkForUpdatesAndInstall);
}