import vue from "@vitejs/plugin-vue";
import { join } from "path";
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
	test: {
		coverage: {
			provider: "istanbul"
		},
		reporters: ["verbose"],
		environment: "happy-dom",
	},
	define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
	resolve: {
		alias: {
			"@/": `${join(PACKAGE_ROOT, "./")}/`,
			"@shared/": `${join(PACKAGE_ROOT, "../shared")}/`,
		},
	},
	plugins: [
		WindiCSS({
			scan: {
				dirs: ["."], // all files in the cwd
				fileExtensions: ["vue", "js", "ts"], // also enabled scanning for js/ts
			},
		}),
		vue(),
	],
	base: "",
	server: {
		fs: {
			strict: true,
		},
		host: true,
		port: 1337,
	},
	build: {
		sourcemap: true,
		outDir: "../../release/dist/renderer",
		assetsDir: ".",
		emptyOutDir: true,
	},
	
});
