/* eslint-disable @typescript-eslint/consistent-type-imports */
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
    path: typeof import("path");
    dialog: Electron.Dialog;
    electron: {
			isMac: boolean, 
			isWindows: boolean, 
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
