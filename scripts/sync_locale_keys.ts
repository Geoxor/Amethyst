import chalk from "chalk";
import fs from "fs";
import path from "path";

const localesFolder = path.join(__dirname, "../src/renderer/locales");
const defaultLocaleFile = path.join(localesFolder, "en-US.json");

function readJsonFile(filePath: string): Record<string, string> {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent);
}

function writeJsonFile(filePath: string, data: Record<string, string>): void {
  const content = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, content, "utf-8");
}

function updateLocaleKeys(targetLocalePath: string, defaultLocale: Record<string, string>): void {
  const targetLocale = readJsonFile(targetLocalePath);

  // Find missing keys in the target locale
  const missingKeys = Object.keys(defaultLocale).filter(key => !(key in targetLocale));

  if (missingKeys.length > 0) {
    // Add missing keys to the target locale
    missingKeys.forEach(key => {
      targetLocale[key] = defaultLocale[key];
    });

    // Write the updated locale back to the file
    writeJsonFile(targetLocalePath, targetLocale);

    console.log(chalk.green(`Updated ${path.basename(targetLocalePath)} with missing keys.`));
  }
}

function synchronizeLocalesWithDefault(): void {
  const defaultLocale = readJsonFile(defaultLocaleFile);

  // Read all locale files in the locales folder
  const localeFiles = fs.readdirSync(localesFolder).filter(file => file.endsWith(".json"));

  // Update each locale file
  localeFiles.forEach(localeFile => {
    const localeFilePath = path.join(localesFolder, localeFile);

    // Skip the default locale file
    if (localeFilePath !== defaultLocaleFile) {
      updateLocaleKeys(localeFilePath, defaultLocale);
    }
  });

  console.log(chalk.blue("Locales synchronized successfully!"));
}

// Run the synchronization
synchronizeLocalesWithDefault();