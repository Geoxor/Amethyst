import { join } from "path";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import WindiCSS from "vite-plugin-windicss";

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
	mode: process.env.MODE,
	root: PACKAGE_ROOT,
	resolve: {
		alias: {
			"@/": `${join(PACKAGE_ROOT, "./")}/`,
		},
	},
	plugins: [WindiCSS({
		scan: {
			dirs: ["."], // all files in the cwd
			fileExtensions: ["vue", "js", "ts"], // also enabled scanning for js/ts
		},
	}), vue()],
	base: "",
	server: {
		fs: {
			strict: true,
		},
		host: true,
		port: process.env.PORT | 1212,
	},
	build: {
		sourcemap: true,
		outDir: "dist",
		assetsDir: ".",
		emptyOutDir: true,
		brotliSize: false,
	},
});
