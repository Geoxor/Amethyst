import type AppState from "./state";

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
  }

  public syncWindowState = async () => {
		const windowState = await this.electron.invoke<{ isMinimized: boolean; isMaximized: boolean }>("sync-window-state");
		this.state.state.isMinimized = windowState.isMinimized;
		this.state.state.isMaximized = windowState.isMaximized;
	};

  public maximize = () => {
    this.invoke("maximize");
    this.syncWindowState();
  };

  public unmaximize = () => {
    this.invoke("unmaximize");
    this.syncWindowState();
  };

  public minimize = () => {
    this.invoke("minimize");
    this.syncWindowState();
  };

  public close = () => {
    this.invoke("close");
    this.syncWindowState();
  };

   public openFileDialog() {
    this.invoke("open-file-dialog");
    }

 public openFolderDialog() {
  this.invoke("open-folder-dialog");
  }
}
