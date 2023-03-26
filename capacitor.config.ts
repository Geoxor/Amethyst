import { CapacitorConfig } from "@capacitor/cli";
import os from "os";

function getIpAddress() {
  const interfaces = os.networkInterfaces();

  let ipAddress;
  Object.keys(interfaces).forEach(ifaceName => {
    interfaces[ifaceName]!.forEach(iface => {
      if (iface.family !== "IPv4" || iface.internal !== false) {
        return;
      }

      ipAddress = iface.address;
      return;
    });
  });

  return ipAddress;
}

const commonConfig: CapacitorConfig = {
  appId: "com.example.app",
  appName: "amethyst",
  webDir: "release/dist/renderer",
  bundledWebRuntime: false,
};

const devConfig: CapacitorConfig = {
  ...commonConfig,
  server: {
    url: `http://${getIpAddress()}:1337`,
    cleartext: true,
  },
};

const prodConfig: CapacitorConfig = {
  ...commonConfig,
};

const config = process.env.NODE_ENV === "development" ? devConfig : prodConfig;

export default config;