import chalk from "chalk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkgPath = path.resolve(__dirname, "../", "package.json");
const mdxPath = path.resolve(__dirname, "../", "docs/guides/installation.mdx");

const { version } = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
if (!version) throw new Error("Version not found in package.json");

const safeVersion = version.startsWith("v") ? version : `v${version}`;
let mdxContent = fs.readFileSync(mdxPath, "utf-8");

mdxContent = mdxContent.replace(
  /https:\/\/github\.com\/Geoxor\/Amethyst\/releases\/download\/v[\d.]+\/([A-Za-z0-9_.-]*?)(?:\d+\.\d+\.\d+)([-_.a-zA-Z0-9]*)/g,
  (_, name, suffix) =>
    `https://github.com/Geoxor/Amethyst/releases/download/${safeVersion}/${name}${version}${suffix}`,
);

mdxContent = mdxContent.replace(
  /([Aa]methyst[-_.])\d+\.\d+\.\d+([-_.a-zA-Z0-9]*)/g,
  (_, prefix, suffix) => `${prefix}${version}${suffix}`,
);

fs.writeFileSync(mdxPath, mdxContent, "utf-8");
console.log(chalk.bgGreen("[Docs]"), chalk.green(`Updated docs/installation.mdx to version ${version}`));
