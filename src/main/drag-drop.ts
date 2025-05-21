import path from "node:path";

import { nativeImage } from "electron";
import { ipcMain } from "electron/main";

import { __dirname } from "./utility.js";

ipcMain.on("ondragstart", async (event, filePath, buffer) => {
  if (!filePath) return;
  const { IS_DEV } = await import("./main.js");
  const iconName = path.join(__dirname, IS_DEV ? "../../../assets/images/audio64x64.png" : "../../../../assets/images/audio64x64.png");
  
  event.sender.startDrag({
    file: filePath,
    icon: buffer ? nativeImage.createFromBuffer(buffer).resize({height: 128, width: 128}) : iconName
  });
});