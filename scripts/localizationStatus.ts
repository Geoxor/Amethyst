import * as fs from "fs";
import * as path from "path";

type JSONObject = Record<string, any>;

const baseLocale = "en-US.json";
const localesDir = path.join(__dirname, "..", "src/renderer/locales");
const outputFile = path.join(__dirname, "..", "LOCALE_COVERAGE.md");

function flatten(obj: JSONObject, prefix = ""): Record<string, string> {
  return Object.entries(obj).reduce((acc: Record<string, string>, [key, val]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === "object" && !Array.isArray(val)) {
      Object.assign(acc, flatten(val, fullKey));
    }
    else {
      acc[fullKey] = String(val);
    }
    return acc;
  }, {});
}

function loadJSON(filePath: string): JSONObject {
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

// Load base locale
const base = loadJSON(path.join(localesDir, baseLocale));
const baseKeys = Object.keys(flatten(base));

// Prepare output markdown
let markdown = "| Locale | Coverage |\n|--------|----------|\n";

// Process each locale
const files = fs.readdirSync(localesDir).filter(
  (file) => file !== baseLocale && file.endsWith(".json"),
);

files.forEach((file) => {
  const locale = file.replace(".json", "");
  const target = loadJSON(path.join(localesDir, file));
  const targetKeys = Object.keys(flatten(target));

  const translatedCount = targetKeys.filter((k) => baseKeys.includes(k)).length;
  const coverage = ((translatedCount / baseKeys.length) * 100).toFixed(1);

  markdown += `| ${locale} | ${coverage}% |\n`;
});

// Write output
fs.writeFileSync(outputFile, markdown);
console.log(`Localization coverage written to ${outputFile}`);
