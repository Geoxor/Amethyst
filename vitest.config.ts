import { mergeConfig, defineConfig } from "vitest/config";
import viteConfig from "./src/renderer/vite.config";

export default mergeConfig(viteConfig, defineConfig({

}));