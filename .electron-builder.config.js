/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
 const config = {
  directories: {
    output: "release/build",
    buildResources: "assets",
  },
  files: ["./release/dist/**/*"],
  extraMetadata: {
    version: process.env.VITE_APP_VERSION,
  },
  npmRebuild: false
};

module.exports = config; 