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
			"@/": `${join(PACKAGE_ROOT, "src")}/`,
		},
	},
	plugins: [WindiCSS(), vue()],
	base: "",
	server: {
		fs: {
			strict: true,
		},
		host: true,
	},
	build: {
		sourcemap: true,
		outDir: "dist",
		assetsDir: ".",
		emptyOutDir: true,
		brotliSize: false,
	},
});
