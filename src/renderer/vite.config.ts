import vue from "@vitejs/plugin-vue";
import { join } from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import path from "path";
import UnoCSS from 'unocss/vite'
import presetIcons from '@unocss/preset-icons';

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
			util: "util/",
		},
	},
	plugins: [
		// VueI18nPlugin({
    //   include: [path.resolve(__dirname, "./locales/*.json")],
    // }),
		nodePolyfills({
			include: ["crypto", "buffer", "path"],
			globals: {
				Buffer: true,
			}
		}),
		UnoCSS({
				presets: [
					presetIcons({}),
				],
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
