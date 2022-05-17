/// <reference types="vite/client" />

import type { Channels } from "main/preload";

declare module "*.vue" {
	import type { DefineComponent } from "vue";
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
	const component: DefineComponent<{}, {}, any>;
	export default component;
}

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

