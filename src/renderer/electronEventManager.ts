import type { AppState } from "@/state";
import { IMetadata } from "../main/metadata";

export class ElectronEventManager {
  public ipc = window.electron.ipcRenderer;

  public constructor(public state: AppState) {
    // These are constant state syncs that get emitted on startup from the main process
    this.ipc.on<string>("version", version => state.state.version = version);
    this.ipc.on<string[]>("allowed-extensions", allowedExtensions => state.state.allowedExtensions = allowedExtensions);
    this.ipc.on<Buffer>("default-cover", image => state.state.defaultCover = URL.createObjectURL(new Blob([image], { type: "image/png" })));

    // These are state syncs that get emitted on every state change
    this.ipc.on("maximize", () => state.state.isMaximized = true);
    this.ipc.on("unmaximize", () => state.state.isMaximized = false);
    this.ipc.on("minimize", () => state.state.isMinimized = true);
    this.ipc.on("focus", () => state.state.isFocused = true);
    this.ipc.on("unfocus", () => state.state.isFocused = false);

    // Shows the update button on the menu bar whenever theres an update ready to be installed
    this.ipc.on("update", () => state.state.updateReady = true);
  }

  public syncWindowState = async () => {
    const windowState = await this.ipc.invoke<{ isMinimized: boolean; isMaximized: boolean }>("sync-window-state");
    this.state.state.isMinimized = windowState.isMinimized;
    this.state.state.isMaximized = windowState.isMaximized;
  };

  private requestWindowStateChange = (state: "minimize" | "maximize" | "unmaximize" | "close") => {
    this.ipc.invoke(state);
    this.syncWindowState();
  };

  public maximize = () => this.requestWindowStateChange("maximize");

  public unmaximize = () => this.requestWindowStateChange("unmaximize");

  public minimize = () => this.requestWindowStateChange("minimize");

  public close = () => this.requestWindowStateChange("close");

  public logPrint = (messages: any[]) => this.ipc.invoke("log-print", [messages]);
  
  public logError = (messages: any[]) => this.ipc.invoke("log-error", [messages]);

  public getCpuUsage = () => this.ipc.invoke("percent-cpu-usage");

  public openFileDialog = () => this.ipc.invoke<{canceled: boolean, filePath: string}>("open-file-dialog");

  public openFolderDialog = () => this.ipc.invoke("open-folder-dialog");

  public showSaveDialog = () => this.ipc.invoke<{canceled: boolean, filePath: string}>("show-save-dialog");
  
  public dropFiles = (paths: string[]) => this.ipc.invoke("drop-file", [paths]);

  public checkForUpdates = () => this.ipc.invoke("check-for-updates");

  public testNotification = (name: string) => this.ipc.invoke("test-notification",[name]);
  
  public open = (url: string) => this.ipc.invoke("open-external", [url]);

  public getCover = (path: string) => this.ipc.invoke<string>("get-cover", [path]);

  public getMetadata = (path: string) => this.ipc.invoke<IMetadata>("get-metadata", [path]);

  public updateRichPresence = (args: (string | undefined)[]) => this.ipc.invoke("update-rich-presence", [args]);
  public clearRichPresence = () => this.ipc.invoke("clear-rich-presence");

  public showDevTools = () => this.ipc.invoke("dev-tools");
  
}
