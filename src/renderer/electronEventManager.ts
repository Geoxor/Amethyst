import type { AppState } from "@/state";
import { FastAverageColorResult } from "fast-average-color";
import { IAudioMetadata } from "music-metadata";

export class ElectronEventManager {
  public electron = window.electron.ipcRenderer;
  private invoke = this.electron.invoke;

  public constructor(public state: AppState) {
    // These are constant state syncs that get emitted on startup from the main process
    this.electron.on<string>("version", version => state.state.version = version);
    this.electron.on<string[]>("allowed-extensions", allowedExtensions => state.state.allowedExtensions = allowedExtensions);
    this.electron.on<Buffer>("default-cover", image => state.state.defaultCover = URL.createObjectURL(new Blob([image], { type: "image/png" })));

    // These are state syncs that get emitted on every state change
    this.electron.on("maximize", () => state.state.isMaximized = true);
    this.electron.on("unmaximize", () => state.state.isMaximized = false);
    this.electron.on("minimize", () => state.state.isMinimized = true);
    this.electron.on("focus", () => state.state.isFocused = true);
    this.electron.on("unfocus", () => state.state.isFocused = false);

    // Shows the update button on the menu bar whenever theres an update ready to be installed
    this.electron.on("update", () => state.state.updateReady = true);
  }

  public syncWindowState = async () => {
    const windowState = await this.invoke<{ isMinimized: boolean; isMaximized: boolean }>("sync-window-state");
    this.state.state.isMinimized = windowState.isMinimized;
    this.state.state.isMaximized = windowState.isMaximized;
  };

  private requestWindowStateChange = (state: "minimize" | "maximize" | "unmaximize" | "close") => {
    this.invoke(state);
    this.syncWindowState();
  };

  public maximize = () => this.requestWindowStateChange("maximize");

  public unmaximize = () => this.requestWindowStateChange("unmaximize");

  public minimize = () => this.requestWindowStateChange("minimize");

  public close = () => this.requestWindowStateChange("close");

  public logPrint = (messages: any[]) => this.invoke("log-print", messages);
  
  public logError = (messages: any[]) => this.invoke("log-error", messages);

  public getCpuUsage = () => this.invoke("percent-cpu-usage");

  public openFileDialog = () => this.invoke("open-file-dialog");

  public openFolderDialog = () => this.invoke("open-folder-dialog");

  public dropFiles = (paths: string[]) => this.invoke("drop-file", paths);

  public checkForUpdates = () => this.invoke("check-for-updates");

  public testNotification = (name: string) => this.invoke("test-notification",[name]);
  
  public open = (url: string) => this.invoke("open-external", [url]);

  public getCover = (path: string) => this.invoke("get-cover", [path]);

  public getCoverColors = (path: string) => this.invoke<FastAverageColorResult>("get-cover-colors", [path]);

  public getMetadata = (path: string) => this.invoke<IAudioMetadata>("get-metadata", [path]);

  public updateRichPresence = (args: string[]) => this.invoke("update-rich-presence", args);
}
