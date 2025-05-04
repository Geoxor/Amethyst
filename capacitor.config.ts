import type { CapacitorConfig } from "@capacitor/cli";
import ip from "ip";

const commonConfig: CapacitorConfig = {
  appId: "com.example.app",
  backgroundColor: "#0f1119",
  appName: "Amethyst",
  webDir: "release/dist/renderer",
  android: {
    path: "src/android",
  },
  ios: {
    path: "src/ios"
  },
};

const devConfig: CapacitorConfig = {
  ...commonConfig,
  server: {
    url: `http://${ip.address()}:6969`,
    cleartext: true,
  },
};

const config = devConfig;
// const config = process.env.NODE_ENV === "development" ? devConfig : commonConfig;

export default config;