import type { Channels } from "../../main/preload";

declare type fs = typeof import("fs/promises");
declare type os = typeof import("os");
declare type path = typeof import("path");

declare global {
  interface Window {
    fs: fs;
    os: os;
    path: path;
    dialog: Electron.Dialog;
    electron: {
			ipcRenderer: {
				invoke<T>(channel: Channels, args?: any[]): Promise<T>
				send(channel: Channels, args: unknown[]): void
				on<T>(
					channel: string,
					func: (...args: T[]) => void
				): (() => void) | undefined
				once<T>(channel: string, func: (...args: T[]) => void): void
			}
		}
  }
}

export { };
