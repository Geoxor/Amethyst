import process from "node:process";

import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [
    VueI18nPlugin({
      include: [path.resolve(__dirname, "./locales/*.json")],
    }),
    UnoCSS(),
    vue(),
  ],
  clearScreen: false,
  server: {
    port: 6969,
    strictPort: true,
    host: host || true,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
});
