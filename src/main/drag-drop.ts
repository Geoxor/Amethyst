import { ipcMain } from "electron/main";
import path from "node:path";
import { __filename, __dirname } from "./utility.js";

const iconName = path.join(__dirname, "../../assets/images/audio64x64.png");

ipcMain.on("ondragstart", (event, filePath) => {
  event.sender.startDrag({
    file: filePath,
    icon: iconName
  });
});