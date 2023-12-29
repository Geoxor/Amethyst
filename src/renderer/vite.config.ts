import vue from "@vitejs/plugin-vue";
import { join } from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import path from "path";
import WindiCSS from "vite-plugin-windicss";

const PACKAGE_ROOT = __dirname;

export default defineConfig({
	mode: process.env.MODE,
	root: PACKAGE_ROOT,
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
		VueI18nPlugin({
      include: [path.resolve(__dirname, "./locales/*.json")],

    }),
		nodePolyfills({
			include: ["crypto", "buffer"],
			globals: {
				Buffer: true,
			}
		}),
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
		port: 6969,
	},
	build: {
		sourcemap: true,
		outDir: "../../release/dist/renderer",
		assetsDir: ".",
		emptyOutDir: true,
	},
});
