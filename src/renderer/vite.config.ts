import { join } from "path";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import WindiCSS from "vite-plugin-windicss";
import Components from "unplugin-vue-components/vite";
import IconsResolver from "unplugin-icons/resolver";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import Icons from "unplugin-icons/vite";

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
			provider: 'istanbul' // or 'c8'
		},
		reporters: ["verbose"]
	},
	resolve: {
		alias: {
			"@/": `${join(PACKAGE_ROOT, "./")}/`,
		},
	},
	plugins: [
		Icons({
			customCollections: {
				fluency: FileSystemIconLoader("./assets/icons/app-icons"),
			},
		}),
		Components({
			resolvers: [
				IconsResolver({
					customCollections: ["fluency"],
				}),
			],
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
		port: Number.parseInt(process.env.PORT || '1212'),
	},
	build: {
		sourcemap: true,
		outDir: "../../release/dist/renderer",
		assetsDir: ".",
		emptyOutDir: true,
	},
});
