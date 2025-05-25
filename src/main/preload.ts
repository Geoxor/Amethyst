import type { IpcRendererEvent } from "electron";

// hack: import electron through cjs so it doesn't throw an error.
const electron = require('electron');
const { ipcRenderer, dialog, webUtils } = electron

import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";

import { md5 } from "./utility.js";

window.fs = fs;
window.os = os;
window.path = path;
window.md5 = md5;
window.dialog = dialog;

window.electron = {
  startDrag: (fileName: string, buffer?: Buffer) => ipcRenderer.send("ondragstart", fileName, buffer),
  isMac: os.platform() === "darwin",
  isWindows: os.platform() === "win32",
  isLinux: os.platform() === "linux",
  showFilePath: (file: File) => webUtils.getPathForFile(file),
  ipcRenderer: {
    invoke<T>(channel: string, args?: unknown[]): Promise<T> {
      return ipcRenderer.invoke(channel, args);
    },
    send(channel: string, args: unknown): void {
      ipcRenderer.send(channel, args);
    },
    on<T>(channel: string, func: (...args: T[]) => void): (() => void) | undefined {
      const subscription = (_event: IpcRendererEvent, ...args: T[]) => func(...args);
      ipcRenderer.on(channel, subscription);
      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once<T>(channel: string, func: (...args: T[]) => void): void {
      ipcRenderer.once(channel, (_event: IpcRendererEvent, ...args: T[]) => func(...args));
    },
  },
};

export { };
