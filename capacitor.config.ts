import { CapacitorConfig } from "@capacitor/cli";

const commonConfig: CapacitorConfig = {
  appId: "com.example.app",
  backgroundColor: "#141621",
  appName: "Amethyst",
  webDir: "release/dist/renderer",
  bundledWebRuntime: false,
  android: {
    path: "src/android",
  },
  ios: {
    path: "src/ios"
  },
};

const devConfig: CapacitorConfig = {
  ...commonConfig,
  // comment this out when building APK
  server: {
    url: "http://192.168.1.68:1337",
    cleartext: true,
  },
};

const config = devConfig;
// const config = process.env.NODE_ENV === "development" ? devConfig : prodConfig;

export default config;