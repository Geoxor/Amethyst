/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { Menu, app } from "electron";
import { checkForUpdatesAndInstall, MainWindow } from "./mainWindow";
import Store from "electron-store";
import si from "systeminformation";

si.audio(data => {
  console.log(data);
});	

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

      if (process.platform === "darwin") {
        Menu.setApplicationMenu(Menu.buildFromTemplate([ 
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" }
              ],
          },
          {
            label: "View",
            submenu: [
              { role: "reload" },
              { role: "forceReload" },
              { role: "toggleDevTools" },
              { type: "separator" },
              { role: "resetZoom", enabled: true },
              { role: "zoomIn", enabled: false },
              { role: "zoomOut", enabled: false },
              { type: "separator" },
              { role: "togglefullscreen" },
            ],
          }
        ]));
      } else {
        // Disables default zoom shortcuts because we remove the default menu actions
        Menu.setApplicationMenu(Menu.buildFromTemplate([ {
          label: "View",
          submenu: [
            { role: "reload" },
            { role: "forceReload" },
            { role: "toggleDevTools" },
            { type: "separator" },
            { role: "resetZoom", enabled: true },
            { role: "zoomIn", enabled: false },
            { role: "zoomOut", enabled: false },
            { type: "separator" },
            { role: "togglefullscreen" },
          ],
        },]));
      }

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
          console.log(argv);
        mainWindow.playAudio(argv[3]);
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
