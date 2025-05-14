import chalk from "chalk";
import fs from "fs";

import packageJson from "../package.json";
const { version, license } = packageJson;

try {
  fs.statSync("./manifests/winget/");
  
} catch (error) {
  fs.mkdirSync("./manifests/winget/", {recursive: true});
}
fs.writeFileSync("./manifests/winget/Geoxor.Amethyst.installer.yaml", `
# Automatically updated by generate_winget_manifest.ts
# Created using wingetcreate 1.0.4.0
# yaml-language-server: $schema=https://aka.ms/winget-manifest.installer.1.1.0.schema.json

PackageIdentifier: Geoxor.Amethyst
PackageVersion: ${version}
Installers:
- Architecture: x64
  InstallerType: nullsoft
  InstallerUrl: https://github.com/Geoxor/Amethyst/releases/download/v${version}/Amethyst-Setup-${version}.exe
  InstallerSha256: 7F973E9B821B772C6DF0362C5DB37899E556823BDB1ACB7CBF1F42868159AD26
- Architecture: x86
  InstallerType: nullsoft
  InstallerUrl: https://github.com/Geoxor/Amethyst/releases/download/v${version}/Amethyst-Setup-${version}.exe
  InstallerSha256: 7F973E9B821B772C6DF0362C5DB37899E556823BDB1ACB7CBF1F42868159AD26
ManifestType: installer
ManifestVersion: 1.1.0
`);

console.log(chalk.bgCyan("[Winget Manifest]"), chalk.cyan("Generated Geoxor.Amethyst.installer.yaml"));

fs.writeFileSync("./manifests/winget/Geoxor.Amethyst.locale.en-US.yaml", `
# Automatically updated by generate_winget_manifest.ts
# Created using wingetcreate 1.0.4.0
# yaml-language-server: $schema=https://aka.ms/winget-manifest.defaultLocale.1.1.0.schema.json

PackageIdentifier: Geoxor.Amethyst
PackageVersion: ${version}
PackageLocale: en-US
Publisher: Geoxor
PackageName: Amethyst
License: ${license}
Copyright: Copyright © ${new Date().getFullYear()} Geoxor
ShortDescription: A music player made with the web platform.
ManifestType: defaultLocale
ManifestVersion: 1.1.0
`);
console.log(chalk.bgCyan("[Winget Manifest]"), chalk.cyan("Generated Geoxor.Amethyst.locale.en-US.yaml"));

fs.writeFileSync("./manifests/winget/Geoxor.Amethyst.yaml", `
# Automatically updated by generate_winget_manifest.ts
# Created using wingetcreate 1.0.4.0
# yaml-language-server: $schema=https://aka.ms/winget-manifest.version.1.1.0.schema.json

PackageIdentifier: Geoxor.Amethyst
PackageVersion: ${version}
DefaultLocale: en-US
ManifestType: version
ManifestVersion: 1.1.0
`);
console.log(chalk.bgCyan("[Winget Manifest]"), chalk.cyan("Generated Geoxor.Amethyst.yaml"));
