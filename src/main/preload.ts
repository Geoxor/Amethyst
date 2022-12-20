import type { IpcRendererEvent } from "electron";
import { contextBridge, ipcRenderer } from "electron";
import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";

contextBridge.exposeInMainWorld("fs", fs);
contextBridge.exposeInMainWorld("os", os);
contextBridge.exposeInMainWorld("path", path);

export type Channels =
	"minimize" |
	"show-save-dialog" |
	"maximize" | 
	"get-appdata-path" |
	"unmaximize" |
	"read-file" |
	"close" |
	"dev-tools" |
	"open-file-dialog" |
	"log-print" |
	"clear-rich-presence" |
	"open-external" |
	"log-error" |
	"open-folder-dialog" |
	"get-cover" |
	"get-metadata" |
	"show-item" |
	"percent-cpu-usage" |
	"update-rich-presence" |
	"sync-window-state" |
	"drop-file" |
	"update" |
	"test-notification" |
	"check-for-updates";

contextBridge.exposeInMainWorld("electron", {
	ipcRenderer: {
		invoke(channel: Channels, args?: string[]) {
			return ipcRenderer.invoke(channel, args);
		},
		send(channel: Channels, args: unknown[]) {
			ipcRenderer.send(channel, args);
		},
		on(channel: Channels, func: (...args: unknown[]) => void) {
			const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
				func(...args);
			ipcRenderer.on(channel, subscription);

			return () => ipcRenderer.removeListener(channel, subscription);
		},
		once(channel: Channels, func: (...args: unknown[]) => void) {
			ipcRenderer.once(channel, (_event, ...args) => func(...args));
		},
	},
});
