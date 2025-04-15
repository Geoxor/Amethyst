declare type fs = typeof import("fs/promises");
declare type os = typeof import("os");
declare type path = typeof import("path");

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
    fs: fs;
    os: os;
    path: path;
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

	interface CSSStyleDeclaration {
		zoom: number;
	}
}

export { };
