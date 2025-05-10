 
declare global {

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
    md5: typeof import("../../main/utility.js").md5;
    path: typeof import("path");
    dialog: Electron.Dialog;
    electron: {
			startDrag: (fileName: string) => void,
			showFilePath: (file: File) => string,
			isMac: boolean, 
			isWindows: boolean, 
			isLinux: boolean,
			ipcRenderer: {
				invoke<T>(channel: string, args?: unknown[]): Promise<T>;
				send(channel: string, args: unknown): void;
				on<T>(channel: string, func: (...args: T[]) => void): (() => void) | undefined;
				once<T>(channel: string, func: (...args: T[]) => void): void;
			};
		}
  }
}

export { };
