import chalk from "chalk";
import fs from "fs";

import packageJson from "../package.json";
const { version, description, license } = packageJson;

const INSTALL_BINARY = `Amethyst-Setup-${version}.exe`;

try {
  fs.statSync("./manifests/scoop/");
  
} catch (error) {
  fs.mkdirSync("./manifests/scoop/", {recursive: true});
}

fs.writeFileSync("./manifests/scoop/amethyst.json", JSON.stringify({
  "$schema" : "https://raw.githubusercontent.com/ScoopInstaller/Scoop/master/schema.json",
  version,
  description,
  license,
  homepage: "https://github.com/Geoxor/amethyst",
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

console.log(chalk.bgCyan("[Scoop Manifest]"), chalk.cyan("Generated amethyst.json"));