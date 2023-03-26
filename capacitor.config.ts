import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.app",
  appName: "amethyst",
  webDir: "release/dist/renderer",
  bundledWebRuntime: false,
  server: {
    url: "http://192.168.0.26:1337",
    cleartext: true,
  },
};

export default config;
