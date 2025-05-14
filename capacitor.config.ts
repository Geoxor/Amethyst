import 'dotenv/config'

import type { CapacitorConfig } from "@capacitor/cli";
import ip from "ip";

const commonConfig: CapacitorConfig = {
  appId: "com.example.app",
  backgroundColor: "#0f1119",
  appName: "Amethyst",
  webDir: "release/dist/renderer",
  android: {
    path: "src/android",
    allowMixedContent: true,
    buildOptions: {
      releaseType: 'APK',
      keystorePath: process.env.KEYSTORE_PATH || 'keystore.jks',
      keystorePassword: process.env.KEYSTORE_PASSWORD,
      keystoreAlias: process.env.KEY_ALIAS,
      keystoreAliasPassword: process.env.KEY_PASSWORD
    },
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

const config = process.env.NODE_ENV === "development" ? devConfig : commonConfig;

console.log(config)


export default config;