/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import {Menu, app, shell } from "electron";
import { checkForUpdatesAndInstall, MainWindow } from "./mainWindow.js";
import Store from "electron-store";
import "./realtimeAudio.js";
import "./drag-drop.js";

export const store = new Store();

let mainWindow: MainWindow;

export const getWindow = () => mainWindow;

export const IS_DEV = process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";
if (process.env.NODE_ENV === "production")
  import("source-map-support").then(smc => smc.install());

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

      mainWindow = new MainWindow();

      if (process.platform === "darwin") {
        Menu.setApplicationMenu(Menu.buildFromTemplate([
          {
            label: app.name,
            submenu: [
              { role: "about" },
              {
                label: "Check for updates...",
                toolTip: "",
                click: async () => {
                  mainWindow.window.webContents.send("check-for-updates");
                }
              },
              { type: "separator" },
              {
                label: "Settings...",
                toolTip: "",
                accelerator: "Cmd+,",
                click: async () => {
                  mainWindow.window.webContents.send("open-settings-native");
                }
              },
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
            label: "File",
            submenu: [
              {
                label: "Open file",
                toolTip: "",
                accelerator: "Cmd+O",
                click: async () => {
                  mainWindow.window.webContents.send("open-file-native");
                }
              },
              {
                label: "Open folder",
                toolTip: "",
                accelerator: "Cmd+Shift+O",
                click: async () => {
                  mainWindow.window.webContents.send("open-folder-native");
                }
              }
            ],
          },
          {
            label: "Queue",
            submenu: [
              {
                label: "Clear queue",
                toolTip: "",
                accelerator: "Cmd+Shift+Z",
                click: async () => {
                  mainWindow.window.webContents.send("clear-queue-native");
                }
              },
              {
                label: "Reload queue",
                toolTip: "",
                accelerator: "Cmd+Alt+R",
                click: async () => {
                  mainWindow.window.webContents.send("reload-queue-native");
                }
              }
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
          },
          {
            role: 'help',
            submenu: [
              {
                label: 'Guides...',
                click: async () => {
                  await shell.openExternal("https://amethyst.geoxor.moe/guides/showcase")
                }
              },
              {
                label: 'User Manual...',
                click: async () => {
                  await shell.openExternal("https://amethyst.geoxor.moe/user-manual/keyboard-shortcuts")
                }
              },
              {
                label: 'Github Repository...',
                click: async () => {
                  await shell.openExternal("https://github.com/geoxor/amethyst")
                }
              },
              {
                label: 'Discord Server...',
                click: async () => {
                  await shell.openExternal("https://discord.gg/geoxor")
                }
              }
            ]
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

      mainWindow.show();

    }).catch();
}

if (!IS_DEV) {
  app
    .whenReady()
    .then(checkForUpdatesAndInstall);
}
