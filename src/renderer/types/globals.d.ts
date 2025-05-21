import { Amethyst } from "@/amethyst.ts";
import { md5 } from "../../main/utility.ts";

declare global {
	// Add type definition for __amethyst__ on globalThis
  var __amethyst__: Amethyst | undefined;

	interface Import {
		meta: {
			env: {
				VITE_APP_TITLE: string
				VITE_APP_PORT: number
			}
		}
	}

  interface Window {
    fs: typeof import("fs/promises");
    os: typeof import("os");
    path: typeof import("path");
    dialog: import('electron').Dialog;
		md5: typeof md5
    electron: {
			isMac: boolean, 
			isWindows: boolean, 
			startDrag: (fileName: string, buffer?: Buffer) => void,
			showFilePath: (file: File) => string,
			isLinux: boolean,
			ipcRenderer: {
				invoke<T>(channel: string, args?: any[]): Promise<T>
				send(channel: string, args: unknown[]): void
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