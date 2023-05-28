import { Player } from "@/logic/player";
import { MediaSession } from "@/mediaSession";
import { Shortcuts } from "@/shortcuts";
import { Store } from "@/state";
import { Capacitor } from "@capacitor/core";
import { StatusBar } from "@capacitor/status-bar";
import {NavigationBar} from "@hugotomazi/capacitor-navigation-bar";
import { ALLOWED_AUDIO_EXTENSIONS } from "@shared/constants";
import { IMetadata } from "@shared/types";
import { FileFilter, OpenDialogReturnValue } from "electron";
import { watch } from "vue";
import { flattenArray } from "./logic/math";
import { Track } from "./logic/track";
import { Directory } from "@capacitor/filesystem";
import * as mm from "music-metadata-browser";
import { router } from "./router";

export type AmethystPlatforms = ReturnType<typeof amethyst.getCurrentPlatform>;

/**
 * Handles interfacing with operating system and unifies methods 
 * to a simple form for all the platforms
 */
class AmethystBackend {
  public constructor() {
    console.log(`Current platform: ${this.getCurrentPlatform()}`);
    console.log(`Current operating system: ${this.getCurrentOperatingSystem()}`);
  }

  private static isPlatformMobile = Capacitor.isNativePlatform();

  private static isPlatformDesktop = navigator.userAgent.indexOf("Electron") >= 0;

  private static isPlatformWeb = !AmethystBackend.isPlatformMobile && !AmethystBackend.isPlatformDesktop;

  private static isOperatingSystemLinux = this.isPlatformDesktop && window.electron.isLinux;

  private static isOperatingSystemWindows = this.isPlatformDesktop && window.electron.isWindows;

  private static isOperatingSystemMac = this.isPlatformDesktop && window.electron.isMac;

  public getCurrentPlatform() {
    if (Amethyst.isPlatformDesktop) return "desktop"; // aka Electron
    if (Amethyst.isPlatformMobile) return "mobile"; // aka Capacitor
    if (Amethyst.isPlatformWeb) return "web"; // aka Webapp
    throw new Error("Unknown platform");
  }

  public getCurrentOperatingSystem() {
    if (Amethyst.isPlatformDesktop) {
      if (Amethyst.isOperatingSystemLinux) return "linux";
      if (Amethyst.isOperatingSystemWindows) return "windows";
      if (Amethyst.isOperatingSystemMac) return "mac";
      throw new Error("Unknown operating system");
    }
    if (Amethyst.isPlatformWeb) {
      if (window.navigator.userAgent.indexOf("Windows") != -1) return "windows";
      if (window.navigator.userAgent.indexOf("Mac") != -1) return "mac";
      if (window.navigator.userAgent.indexOf("X11") != -1) return "unix";
      if (window.navigator.userAgent.indexOf("Linux") != -1) return "linux";
      throw new Error("Unknown operating system");
    }
    if (Amethyst.isPlatformMobile) {
      return "android";
    }
    throw new Error("Unknown operating system");
  }

  public openLink(url: string) {
    switch (this.getCurrentPlatform()) {
      case "desktop":
        return window.electron.ipcRenderer.invoke("open-external", [url]);
      case "web":
        const openLinkInNewTab = (url: string) => {
          const newWindow = window.open(url, "_blank", "noopener,noreferrer");
          if (newWindow) {
            newWindow.opener = null;
          }
        };
        return openLinkInNewTab(url);
      default:
        return;
    }
  }

  public showItem(path: string) {
    switch (this.getCurrentPlatform()) {
      case "desktop":
        return window.electron.ipcRenderer.invoke("show-item", [path]); 
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

  public async openFileDialog(filters?: FileFilter[]): Promise<OpenDialogReturnValue> {
    switch (this.getCurrentPlatform()) {
      case "desktop":
        return window.electron.ipcRenderer.invoke<OpenDialogReturnValue>("open-file-dialog", [filters]);
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
    switch (this.getCurrentPlatform()) {
      case "desktop":
        return window.electron.ipcRenderer.invoke<OpenDialogReturnValue>("open-folder-dialog", [filter]);
      default:
        return;
    }
  }

  public openAudioFilesAndAddToQueue = () => {
    amethyst.openFileDialog([{ name: "Audio", extensions: ALLOWED_AUDIO_EXTENSIONS }])?.then(result => {
      !result.canceled && amethyst.player.queue.add(result.filePaths);
    });
  };
  
  public openAudioFoldersAndAddToQueue = () => {
    amethyst.openFolderDialog(ALLOWED_AUDIO_EXTENSIONS)?.then(result => {
      !result.canceled && amethyst.player.queue.add(flattenArray(result.filePaths));
    });
  };

  // TODO: get rid of this stupid logic and make it be part of when loading a track
  public async getMetadata(path: string) {
    switch (this.getCurrentPlatform()) {
      case "desktop":
        return window.electron.ipcRenderer.invoke<IMetadata>("get-metadata", [path]);
      case "mobile":
        const response = await fetch(decodeURIComponent(path));
        const buffer = new Uint8Array(await response.arrayBuffer());
        const {format, common} = await mm.parseBuffer(buffer, undefined);
        const size = buffer.length;
        return {format, common, size } as IMetadata;
      default:
        return;
    }
  }

  public async getCover(path: string) {
    switch (this.getCurrentPlatform()) {
      case "desktop":
        return window.electron.ipcRenderer.invoke<string>("get-cover", [path]);
        case "mobile":
          const response = await fetch(decodeURIComponent(path));
          const buffer = new Uint8Array(await response.arrayBuffer());
          const {common} = await mm.parseBuffer(buffer, undefined);
          if (common.picture) {
            return common.picture[0].data.toString("base64") as string;
          }
          return;
      default:
        return;
    }
  }
}

export class Amethyst extends AmethystBackend {
  public VERSION = APP_VERSION;
  // @ts-ignore
  public IS_DEV = import.meta.env.DEV;
  public APPDATA_PATH: string | undefined;

  public store: Store = new Store();
  public shortcuts: Shortcuts = new Shortcuts();
  public player = new Player();
  public mediaSession: MediaSession | undefined = this.getCurrentPlatform() === "desktop" ? new MediaSession(this.player) : undefined;
  
  public constructor() {
    super();

    // Init zoom from store
    document.body.style.zoom = this.store.settings.value.zoomLevel;

    if (this.getCurrentPlatform() === "desktop") {
      window.electron.ipcRenderer.invoke<string>("get-appdata-path").then(path => this.APPDATA_PATH = path);

      window.electron.ipcRenderer.on("maximize", () => this.store.state.isMaximized = true);
      window.electron.ipcRenderer.on("unmaximize", () => this.store.state.isMaximized = false);
      window.electron.ipcRenderer.on("minimize", () => this.store.state.isMinimized = true);
      window.electron.ipcRenderer.on("focus", () => this.store.state.isFocused = true);
      window.electron.ipcRenderer.on("unfocus", () => this.store.state.isFocused = false);

      window.electron.ipcRenderer.on("update", () => this.store.state.updateReady = true);

      window.electron.ipcRenderer.on<string>("play-file", path => path !== "--require" && amethyst.player.queue.add(path).then(() => {
        amethyst.player.play(amethyst.player.queue.getList().findIndex(track => track.path == path));
      }));
      window.electron.ipcRenderer.on<(string)[]>("play-folder", paths => amethyst.player.queue.add(flattenArray(paths)));
  
      // #region move this to the discord plugin
      let richPresenceTimer: NodeJS.Timer | undefined;

      const updateRichPresence = (track: Track) => {
        const sendData = () => {
        const args = [
          track.getArtistsFormatted() && track.getTitleFormatted() ? `${track.getArtistsFormatted()} - ${track.getTitleFormatted()}` : track.getFilename(),
            this.player.isPaused.value ? "Paused" : `${this.player.currentTimeFormatted(true)} - ${track.getDurationFormatted(true)}`,
            track.metadata.data?.format.container?.toLowerCase() || "unknown format"
          ];
          window.electron.ipcRenderer.invoke("update-rich-presence", [args]);
        };

        richPresenceTimer && clearInterval(richPresenceTimer);
        sendData();
        richPresenceTimer = setInterval(() => sendData(), 1000);
      };

      const updateWithCurrentTrack = () => {
        const currentTrack = this.player.getCurrentTrack();
        currentTrack && updateRichPresence(currentTrack);
      };

      if (this.store.settings.value.useDiscordRichPresence) {
        this.player.on("play", () => {
          updateWithCurrentTrack();
        });
      };

      watch(() => this.store.settings.value.useDiscordRichPresence, value => {
        value ? updateWithCurrentTrack() : richPresenceTimer && clearInterval(richPresenceTimer);
      });
      // #endregion
    }

    if (this.getCurrentPlatform() === "mobile") {
      this.initMobile();
    }

    document.addEventListener("drop", event => {
      event.preventDefault();
      event.stopPropagation();
      amethyst.player.queue.add(Array.from(event.dataTransfer!.files).map(f => f.path));
      amethyst.player.play(amethyst.player.queue.getList()[amethyst.player.queue.getList().length - 1]);
    });

    document.addEventListener("dragover", e => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  public openDevTools() {
    if (this.getCurrentPlatform() !== "desktop") return;
    window.electron.ipcRenderer.invoke("dev-tools");
  }

  public openSettings = () => {
    router.push({ name: "settings.appearance" });
  };

  public reload = () => {
    location.reload();
  };

  public zoom(action: "in" | "out" | "reset") {
    const currentZoom = amethyst.store.settings.value.zoomLevel;
    let newZoom = currentZoom;

    switch (action) {
      case "in":
        newZoom = currentZoom + .125;
        break;
      case "out":
        newZoom = currentZoom - .125;
        break;
      case "reset":
        newZoom = amethyst.store.defaultSettings.zoomLevel;
        break;
    }

    // Update store with new zoom level
    amethyst.store.settings.value.zoomLevel = newZoom;

    // Set new zoom level
    document.body.style.zoom = newZoom;
  }

  public performWindowAction(action: "close" | "maximize" | "unmaximize" | "minimize"): void {
    if (this.getCurrentPlatform() === "desktop") {
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

  private async initMobile() {
    switch (this.getCurrentOperatingSystem()) {
      case "android":
        await StatusBar.setBackgroundColor({color: "#0f1119"});
        await NavigationBar.setColor({color: "#181a27"});
        break;
      default:
        break;
    }

    this.loadMusicFolder();
  }

  /**
   * Loads all the music in Documents/Music to the queue
   * @mobile_only
   */
  private loadMusicFolder = async () => {
    const { Filesystem } = await import("@capacitor/filesystem");
    const evalPermission = async () => {
      const status = await Filesystem.requestPermissions();
      if (status.publicStorage == "denied") evalPermission();
    };

    const evalMusicFolder = async () => {
      Filesystem.stat({ directory: Directory.Documents, 
        path: "Music" }).catch(() => {
          Filesystem.mkdir({ directory: Directory.Documents, 
            path: "Music", recursive: true })
          .then(() => {
            console.log("Created music folder in Documents/Music");
          }).catch(err => {
            console.log(err);
          });
        });
    };

    await evalPermission();
    await evalMusicFolder();
    const {files} = await Filesystem.readdir({
      path: "Music",
      directory: Directory.Documents,
    });
    
    this.player.queue.add(files.map(file => Capacitor.convertFileSrc(file.uri)));
  };

  public async checkForUpdates() {
    this.store.state.isCheckingForUpdates = true;
    try {
      switch (this.getCurrentPlatform()) {
        case "desktop":
          await window.electron.ipcRenderer.invoke("check-for-updates");
          break; 
        default:
          break;
      }
        
    } catch (error) {
      console.log(error);
    }
    this.store.state.isCheckingForUpdates = false;
  }

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
