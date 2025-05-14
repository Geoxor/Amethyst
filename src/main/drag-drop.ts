import path from "node:path";

import { ipcMain } from "electron/main";

import { __dirname } from "./utility.js";

ipcMain.on("ondragstart", async (event, filePath) => {
  const { IS_DEV } = await import("./main.js");
  const iconName = path.join(__dirname, IS_DEV ? "../../../assets/images/audio64x64.png" : "../../../../assets/images/audio64x64.png");

  if (!filePath) return;
  console.log('started dragging', iconName)
  event.sender.startDrag({
    file: filePath,
    icon: iconName
  });
});