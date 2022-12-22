import fs from "fs";
import {version, description, license} from "../package.json";

const INSTALL_BINARY = `Amethyst-Setup-${version}.exe`;

try {
  fs.statSync("./scripts/scoop/");
  
} catch (error) {
  fs.mkdirSync("./scripts/scoop/", {recursive: true});
}

fs.writeFileSync("./scripts/scoop/amethyst.json", JSON.stringify({
  version,
  description,
  license,
  architecture: {
    "64bit": {
        url: `https://github.com/Geoxor/Amethyst/releases/download/v${version}/${INSTALL_BINARY}`,
        extract_dir: "Files\\Amethyst"
    },
    "32bit": {
        url: `https://github.com/Geoxor/Amethyst/releases/download/v${version}/${INSTALL_BINARY}`,
        extract_dir: "Files\\Amethyst"
    },
  },
  pre_install: [
    `Invoke-ExternalCommand "$dir\\${INSTALL_BINARY}" | Out-Null`,
    "info 'Amethyst has been installed'",
  ],
  post_install: [
    `Remove-Item "$dir\\${INSTALL_BINARY}"`
  ],
  uninstaller: {
    script: "Invoke-ExternalCommand \"C:\\Users\\$env:username\\AppData\\Local\\Programs\\amethyst\\Uninstall Amethyst.exe\" | Out-Null"
  }

}, null, 2));
