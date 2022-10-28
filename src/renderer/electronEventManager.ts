import type AppState from "@/state";

export default class ElectronEventManager {
  public electron = window.electron.ipcRenderer;
  public invoke = this.electron.invoke;

  constructor(public state: AppState) {
    // These are constant state syncs that get emitted on startup from the main process
    this.electron.on<string>("version", version => state.state.version = version);
    this.electron.on<string[]>("allowed-extensions", allowedExtensions => state.state.allowedExtensions = allowedExtensions);
    this.electron.on<Buffer>("default-cover", image => state.state.defaultCover = URL.createObjectURL(new Blob([image], { type: "image/png" })));

    // These are state syncs that get emitted on every state change
    this.electron.on("maximize", () => state.state.isMaximized = true);
    this.electron.on("unmaximize", () => state.state.isMaximized = false);
    this.electron.on("minimize", () => state.state.isMinimized = true);

    // Shows the update button on the menu bar whenever theres an update ready to be installed
    this.electron.on("update", () => state.state.updateReady = true);
  }

  public syncWindowState = async () => {
    const windowState = await this.electron.invoke<{ isMinimized: boolean; isMaximized: boolean }>("sync-window-state");
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

  public openFileDialog = () => this.invoke("open-file-dialog");

  public openFolderDialog = () => this.invoke("open-folder-dialog");
}
