/// <reference types="vite/client" />

import type { Channels } from "main/preload";

// Preload
declare global {
	interface Window {
		electron: {
			ipcRenderer: {
				invoke<T>(channel: Channels, args?: string[]): Promise<T>
				send(channel: Channels, args: unknown[]): void
				on(
					channel: string,
					func: (...args: unknown[]) => void
				): (() => void) | undefined
				once(channel: string, func: (...args: unknown[]) => void): void
			}
		}
	}
}

export {};

