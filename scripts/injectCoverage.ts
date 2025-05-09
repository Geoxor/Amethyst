import * as fs from "fs";
import * as path from "path";

const readmePath = path.join(__dirname, "..", "README.md");
const coveragePath = path.join(__dirname, "..", "LOCALE_COVERAGE.md");

const readme = fs.readFileSync(readmePath, "utf-8");
const coverage = fs.readFileSync(coveragePath, "utf-8");

const newReadme = readme.replace(
  /<!-- START LOCALE_COVERAGE -->([\s\S]*?)<!-- END LOCALE_COVERAGE -->/,
  `<!-- START LOCALE_COVERAGE -->\n${coverage.trim()}\n<!-- END LOCALE_COVERAGE -->`
);

fs.writeFileSync(readmePath, newReadme);
console.log("✅ README.md updated with localization coverage!");
