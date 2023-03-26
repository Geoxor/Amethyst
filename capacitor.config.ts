import { CapacitorConfig } from "@capacitor/cli";

const commonConfig: CapacitorConfig = {
  appId: "com.example.app",
  appName: "amethyst",
  webDir: "release/dist/renderer",
  bundledWebRuntime: false,
};

const devConfig: CapacitorConfig = {
  ...commonConfig,
  server: {
    url: "http://192.168.0.26:1337",
    cleartext: true,
  },
};

const config = devConfig;
// const config = process.env.NODE_ENV === "development" ? devConfig : prodConfig;

export default config;