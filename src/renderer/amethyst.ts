// import { ElectronEventManager } from "@/electronEventManager";
// import { CPUUsageMonitor } from "@/logic/CPUUsageMonitor";
import { player } from "@/logic/player";
// import { Track } from "@/logic/track";
import { MediaSession } from "@/mediaSession";
import { Shortcuts } from "@/shortcuts";
import { Store } from "@/state";
// import { watch } from "vue";
import { Capacitor } from "@capacitor/core";
import { IMetadata } from "@shared/types";

/**
 * Handles interfacing with operating system and unifies methods 
 * to a simple form for all the platforms
 */
class AmethystBackend {
  public CURRENT_PLATFORM: ReturnType<typeof this.getCurrentPlatform> = this.getCurrentPlatform();
  public APPDATA_PATH = "";

  public constructor() {
    console.log(`Current platform: ${this.CURRENT_PLATFORM}`);

    if (AmethystBackend.isPlatformDesktop)
      window.electron.ipcRenderer.invoke<string>("get-appdata-path").then(path => this.APPDATA_PATH = path);
  }

  public static isPlatformMobile = Capacitor.isNativePlatform();

  public static isPlatformDesktop = navigator.userAgent.indexOf("Electron") >= 0;

  public static isPlatformWeb = !AmethystBackend.isPlatformMobile && !AmethystBackend.isPlatformDesktop;

  public getCurrentPlatform() {
    if (Amethyst.isPlatformDesktop) return "desktop"; // aka Electron
    if (Amethyst.isPlatformMobile) return "mobile"; // aka Capacitor
    if (Amethyst.isPlatformWeb) return "web"; // aka Webapp
    throw new Error("Unknown platform");
  }

  public checkForUpdates() {
    switch (this.CURRENT_PLATFORM) {
      case "desktop":
        return window.electron.ipcRenderer.invoke("check-for-updates");
      default:
        return;
    }
  }

  // Useful only for web version
  private openLinkInNewTab(url: string) {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) {
      newWindow.opener = null;
    }
  }

  public openLink(url: string) {
    switch (this.CURRENT_PLATFORM) {
      case "desktop":
        return window.electron.ipcRenderer.invoke("open-external", [url]);
      case "web":
        return this.openLinkInNewTab(url);
      default:
        return;
    }
  }

  private filesToBlobs(files: FileList): Promise<Blob>[] {
    const promises: Promise<Blob>[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const promise = new Promise<Blob>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const blob = new Blob([reader.result as ArrayBuffer]);
          resolve(blob);
        };
        reader.onerror = () => {
          reject(new Error(`Failed to read file "${file.name}"`));
        };
        reader.readAsArrayBuffer(file);
      });
      promises.push(promise);
    }
    return promises;
  }

  public async openFileDialog(filters?: Electron.FileFilter[]): Promise<Electron.OpenDialogReturnValue> {
    switch (this.CURRENT_PLATFORM) {
      case "desktop":
        return window.electron.ipcRenderer.invoke<Electron.OpenDialogReturnValue>("open-file-dialog", [filters]);
      case "web":
        const fileInput = document.createElement("input");
          fileInput.type = "file";
          fileInput.multiple = true;
          fileInput.click();

        // TODO: make a AmethystFile and AmethystAudioFile classes to manage this bullshit easily
        return new Promise((res, rej) => {
          fileInput.addEventListener("change", async event => {
            const files = (event.target as HTMLInputElement).files;
            if (!files) rej("no files");
            const blobs = await Promise.all(this.filesToBlobs(files!));
            const paths = blobs.map(blob => URL.createObjectURL(blob));
            files ? res({canceled: false, filePaths: paths}) : rej();
          });
        });
      default:
        return Promise.reject();
    }
  }
  public openFolderDialog(filter?: string[]) {
    switch (this.CURRENT_PLATFORM) {
      case "desktop":
        return window.electron.ipcRenderer.invoke<Electron.OpenDialogReturnValue>("open-folder-dialog", [filter]);
      default:
        return;
    }
  }

  // TODO: get rid of this stupid logic and make it be part of when loading a track
  public getMetadata(path: string) {
    switch (this.CURRENT_PLATFORM) {
      case "desktop":
        return window.electron.ipcRenderer.invoke<IMetadata>("get-metadata", [path]);
      default:
        return;
    }
  }

  public getCover(path: string) {
    switch (this.CURRENT_PLATFORM) {
      case "desktop":
        return window.electron.ipcRenderer.invoke<IMetadata>("get-cover", [path]);
      default:
        return;
    }
  }
}

export class Amethyst extends AmethystBackend {
  public VERSION = APP_VERSION;
  // @ts-ignore
  public IS_DEV = import.meta.env.DEV;

  public store: Store = new Store();
  public shortcuts: Shortcuts = new Shortcuts();
  public mediaSession: MediaSession = new MediaSession();
  // public cpuUsageMonitor: CPUUsageMonitor = new CPUUsageMonitor(this.store, this.electron);

  // private richPresenceTimer: NodeJS.Timer | undefined;

  public constructor() {
    super();

    if (this.CURRENT_PLATFORM === "desktop") {
      window.electron.ipcRenderer.on("maximize", () => this.store.state.isMaximized = true);
      window.electron.ipcRenderer.on("unmaximize", () => this.store.state.isMaximized = false);
      window.electron.ipcRenderer.on("minimize", () => this.store.state.isMinimized = true);
      window.electron.ipcRenderer.on("focus", () => this.store.state.isFocused = true);
      window.electron.ipcRenderer.on("unfocus", () => this.store.state.isFocused = false);
    }

    // this.electron.ipc.on<string>("play-file", path => path !== "--require" && player.queue.add(path).then(() => {
    //   player.play(player.queue.getList().findIndex(track => track.path == path));
    // }));
    // this.electron.ipc.on<(string)[]>("play-folder", paths => player.queue.add(flattenArray(paths)));

    // watch(() => this.store.settings.useDiscordRichPresence, value => {
    //   if (value) {
    //     const currentTrack = player.getCurrentTrack();
    //     currentTrack && this.updateRichPresence(currentTrack);
    //     return;
    //   };
    //   this.richPresenceTimer && clearInterval(this.richPresenceTimer);
    //   this.electron.clearRichPresence();
    // });

    document.addEventListener("drop", event => {
      event.preventDefault();
      event.stopPropagation();
      player.queue.add(Array.from(event.dataTransfer!.files).map(f => f.path));
      player.play(player.queue.getList()[player.queue.getList().length - 1]);
    });

    document.addEventListener("dragover", e => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  public performWindowAction(action: "close" | "maximize" | "unmaximize" | "minimize"): void {
    if (this.CURRENT_PLATFORM === "desktop") {
      window.electron.ipcRenderer.invoke(action).then(() => this.syncWindowState());
    } else {
      throw new Error(`${this.performWindowAction.name} can only be executed when running in 'desktop' (electron) client`);
    }
  }

  private syncWindowState = async () => {
    const windowState = await window.electron.ipcRenderer.invoke<{ isMinimized: boolean; isMaximized: boolean }>("sync-window-state");
    this.store.state.isMinimized = windowState.isMinimized;
    this.store.state.isMaximized = windowState.isMaximized;
  };

  // private updateRichPresence(track: Track){
  //   const sendData = () => {
  //     this.electron.updateRichPresence([
  //       `${track.getArtistsFormatted() || "unknown artist"} - ${track.getTitleFormatted() || "unknown title"}`,
  //       player.isPaused.value ? "Paused" : `${player.currentTimeFormatted(true)} - ${track.getDurationFormatted(true)}`,
  //       track.metadata.data?.format.container?.toLowerCase()
  //     ]);
  //   };

  //   this.richPresenceTimer && clearInterval(this.richPresenceTimer);
  //   sendData();
  //   this.richPresenceTimer = setInterval(() => sendData(), 1000);
  // }
}

export const amethyst = new Amethyst();

export const useState = () => amethyst.store;
export const useShortcuts = () => amethyst.shortcuts;

// interface IPluginDefinitionParameters {
//   store: Store, 
//   electron: ElectronEventManager, 
//   shortcuts: Shortcuts, 
//   player: Player
// }

// export const definePlugin = (register: (options: IPluginDefinitionParameters) => any) => {
//   const {store, electron, shortcuts} = amethyst;
//   const plugin = register({store, electron, shortcuts, player});
//   console.log(plugin);
// };
