import { ipcMain } from "electron/main";
const path = require("node:path");
const iconName = path.join(__dirname, "../../assets/images/audio64x64.png");

ipcMain.on("ondragstart", (event, filePath) => {
  event.sender.startDrag({
    file: filePath,
    icon: iconName
  });
});