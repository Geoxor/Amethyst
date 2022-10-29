import type { Channels } from "../../main/preload";

// Preload
declare global {
	interface Window {
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
