import type { IpcRendererEvent } from "electron";
import { contextBridge, ipcRenderer } from "electron";
import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";
import {md5} from "./utility";

contextBridge.exposeInMainWorld("fs", fs);
contextBridge.exposeInMainWorld("os", os);
contextBridge.exposeInMainWorld("path", path);
contextBridge.exposeInMainWorld("md5", md5);

contextBridge.exposeInMainWorld("electron", {
	isMac: os.platform() === "darwin", 
	isWindows: os.platform() === "win32", 
	isLinux: os.platform() === "linux",
	startDrag: (fileName: string) => ipcRenderer.send("ondragstart", fileName),
	ipcRenderer: {
		invoke(channel: string, args?: string[]) {
			return ipcRenderer.invoke(channel, args);
		},
		send(channel: string, args: unknown[]) {
			ipcRenderer.send(channel, args);
		},
		on(channel: string, func: (...args: unknown[]) => void) {
			const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
				func(...args);
			ipcRenderer.on(channel, subscription);

			return () => ipcRenderer.removeListener(channel, subscription);
		},
		once(channel: string, func: (...args: unknown[]) => void) {
			ipcRenderer.once(channel, (_event, ...args) => func(...args));
		},
	},
});
