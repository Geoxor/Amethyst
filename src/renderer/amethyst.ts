import { Player } from "@/logic/player";
import { MediaSession } from "@/mediaSession";
import { Shortcuts } from "@/shortcuts";
import { State } from "@/state";
import { MediaSourceManager } from "@/logic/mediaSources";
import { Capacitor } from "@capacitor/core";
import { StatusBar } from "@capacitor/status-bar";
import {NavigationBar} from "@hugotomazi/capacitor-navigation-bar";
import { ALLOWED_AUDIO_EXTENSIONS } from "@shared/constants";
import type { OpenDialogReturnValue, SaveDialogReturnValue } from "electron";
import { ref, watch } from "vue";
import { flattenArray } from "./logic/math";
import { Directory } from "@capacitor/filesystem";
import { router } from "./router";
import "./logic/subsonic";
import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";
import { useLocalStorage } from "@vueuse/core";
import type { Track } from "./logic/track";

export const i18n = createI18n({
  fallbackLocale: "en-US", // set fallback locale
  locale: localStorage.getItem("settings") !== null ? JSON.parse(localStorage.getItem("settings")!).language : "en-US",
  messages,
});

export type AmethystPlatforms = ReturnType<typeof amethyst.getCurrentPlatform>;
export const favoriteTracks = useLocalStorage<string[]>("favoriteTracks", []);

/**
 * Handles interfacing with operating system and unifies methods 
 * to a simple form for all the platforms
 */
export class AmethystBackend{
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

  public async openLink(url: string) {
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
        return Promise.reject();
    }
  }

  public async showItem(path: string) {
    switch (this.getCurrentPlatform()) {
      case "desktop":
        return window.electron.ipcRenderer.invoke("show-item", [path]); 
      default:
        return Promise.reject();
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

  public async showOpenFileDialog(options?: Electron.OpenDialogOptions): Promise<OpenDialogReturnValue> {
    switch (this.getCurrentPlatform()) {
      case "desktop":
        return window.electron.ipcRenderer.invoke<OpenDialogReturnValue>("open-file-dialog", [options]);
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
      case "mobile":
        return new Promise(async (res, rej) => {
          // use capacitor to implement getting a file path
          const {FilePicker} = await import("@capawesome/capacitor-file-picker");
          const result = await FilePicker.pickFiles({ readData: true, types: ["application/json", "text/comma-separated-values", "text/*"]});
          const path = result.files.map(file => file.path!)[0];
          path ? res({canceled: false, filePaths: [decodeURIComponent(path)]}) : rej();
        });
      default:
        return Promise.reject();
    }
  }
  
  public async showOpenFolderDialog() {
    switch (this.getCurrentPlatform()) {
      case "desktop":
        return window.electron.ipcRenderer.invoke<OpenDialogReturnValue>("open-folder-dialog");
      default:
        return Promise.reject();
    }
  }

  public async showSaveFileDialog(options?: Electron.SaveDialogOptions) {
    switch (this.getCurrentPlatform()) {
      case "desktop":
        return window.electron.ipcRenderer.invoke<SaveDialogReturnValue>("show-save-dialog", [options]);
      default:
        return Promise.reject();
    }
  }

  public async writeFile(data: string | Buffer, path: string) {
    switch (this.getCurrentPlatform()) {
      case "desktop":
        return window.fs.writeFile(path, data);
      default:
        return Promise.reject();
    }
  };

  public openAudioFilesAndAddToQueue = async () => {
    amethyst.showOpenFileDialog({filters: [{ name: "Audio", extensions: ALLOWED_AUDIO_EXTENSIONS }]}).then(result => {
      !result.canceled && amethyst.player.queue.add(result.filePaths);
    }).catch(error => console.error(error));
  };

  public openAudioFoldersAndAddToQueue = async () => {
    amethyst.showOpenFolderDialog().then(async result => {
      !result.canceled && amethyst.player.queue.add(await this.scanFolderForFiles(result.filePaths[0]));
    }).catch(error => console.error(error));
  };

  private scanFolderForFiles = async (path: string) => {
    const files = await window.fs.readdir(path);
    const result: string[] = [];

    for (const file of files) {
      const fullPath = window.path.join(path, file);

      // Attempt to read the path as a folder
      try {
        await window.fs.access(fullPath);
        result.push(...await this.scanFolderForFiles(fullPath));
      } catch (_) {
        if (ALLOWED_AUDIO_EXTENSIONS.some(extension => file.endsWith(extension)))
          result.push(fullPath);
      }
    }

    return result;
  };
}

export class Amethyst extends AmethystBackend {
  public VERSION = APP_VERSION;
  // @ts-ignore
  public IS_DEV = import.meta.env.DEV;
  public APPDATA_PATH: string | undefined;
  public isLoading = ref(false);
  public state: State = new State();
  public player = new Player(this);
  public shortcuts: Shortcuts = new Shortcuts();
  public mediaSession: MediaSession | undefined = this.getCurrentPlatform() === "desktop" ? new MediaSession(this.player) : undefined;
  public mediaSourceManager: MediaSourceManager = new MediaSourceManager(this);

  public constructor() {
    super();

    // Init zoom from store
    document.body.style.zoom = this.state.settings.value.zoomLevel.toString();

    if (this.getCurrentPlatform() === "desktop") {
      window.electron.ipcRenderer.invoke<string>("get-appdata-path").then(path => this.APPDATA_PATH = path);

      window.electron.ipcRenderer.on("maximize", () => this.state.window.isMaximized = true);
      window.electron.ipcRenderer.on("unmaximize", () => this.state.window.isMaximized = false);
      window.electron.ipcRenderer.on("minimize", () => this.state.window.isMinimized = true);
      window.electron.ipcRenderer.on("focus", () => this.state.window.isFocused = true);
      window.electron.ipcRenderer.on("unfocus", () => this.state.window.isFocused = false);

      window.electron.ipcRenderer.on("update", () => this.state.window.updateReady = true);

      window.electron.ipcRenderer.on<string>("play-file", path => path !== "--require" && amethyst.player.queue.add(path).then(() => {
        amethyst.player.play(amethyst.player.queue.getList().findIndex(track => track.path == path));
      }));
      window.electron.ipcRenderer.on<(string)[]>("play-folder", paths => amethyst.player.queue.add(flattenArray(paths)));
  
      this.state.settings.value.fetchMetadataOnStartup && setTimeout(() => this.player.queue.fetchAsyncData(), 1000);
    }

    if (this.getCurrentPlatform() === "mobile") {
      this.initMobile();
    }

    this.handleFileDrops();
    this.handleDiscordRichPresence();

    if (this.state.settings.value.autoPlayOnStartup) {
      const track = this.player.queue.getTrack(0);
      track && this.player.play(track);
    }
    
  }

  private handleDiscordRichPresence() {
    let richPresenceTimer: NodeJS.Timeout | undefined;

    const clearRichPresence = () => {
      richPresenceTimer && clearInterval(richPresenceTimer);
      window.electron.ipcRenderer.invoke("clear-rich-presence");
    };

    const updateRichPresence = async (track: Track) => {
      const sendData = () => {
      const args = [
        track.getArtistsFormatted() && track.getTitleFormatted() ? `${track.getArtistsFormatted()} - ${track.getTitleFormatted()}` : track.getFilename(),
          this.player.isPaused.value ? "Paused" : `${this.player.currentTimeFormatted(true)} - ${track.getDurationFormatted(true)}`,
          track.metadata.data?.format.container?.toLowerCase() || "unknown format",
          track.albumUrl
        ];
        window.electron.ipcRenderer.invoke("update-rich-presence", [args]);
      };

      richPresenceTimer && clearInterval(richPresenceTimer);
      sendData();
      richPresenceTimer = setInterval(() => sendData(), 5000);
    };

    const updateWithCurrentTrack = async () => {
      const currentTrack = this.player.getCurrentTrack();
      await currentTrack?.fetchAlbumCoverUrl();
      currentTrack && await updateRichPresence(currentTrack);
    };

    if (this.state.settings.value.useDiscordRichPresence) {
      this.player.on("play", async () => {
        await updateWithCurrentTrack();
      });
    };

    watch(() => this.state.settings.value.useDiscordRichPresence, value => {
      value ? updateWithCurrentTrack() : clearRichPresence();
    });
  }

  private handleFileDrops() {
    const filteredAllowedAudioExtensions = (path: string) => {
      const extension = path.split(".").pop();
      return extension && ALLOWED_AUDIO_EXTENSIONS.includes((extension).toLowerCase());
    };

    document.addEventListener("drop", async event => {
      // TODO: add logic that plays the new song if the user has that enabled as an option, 
      // also if they drop a song that is already in the queue, find that song and play it if the user has that enabled as an option
      this.isLoading.value = true;

      event.preventDefault();
      event.stopPropagation();

      const droppedPath = event.dataTransfer!.files[0]!.path;

      const usableFiles = 
        Array.from(event.dataTransfer!.files)
          .map(file => file.path)
          .filter(filteredAllowedAudioExtensions);

      // We are dealing with a file dropped
      if (usableFiles.length !== 0) amethyst.player.queue.add(usableFiles);

      // We are dealing with a folder dropped
      else {
        try {
          await window.fs.access(droppedPath);
          // recursive for folders within folders, use window.fs is fs.promises
          const recursiveReadDir = async (path: string) => {
            const files = await window.fs.readdir(path);
            for (const file of files) {
              const filePath = window.path.join(path, file);
              // try to check if it's a folder
              try {
                await window.fs.access(filePath);
                await recursiveReadDir(filePath);
              } catch (error) {
                // Not a folder so add it as a file   
                amethyst.player.queue.add([filePath].filter(filteredAllowedAudioExtensions));
              }
            }
          };

          await recursiveReadDir(droppedPath);
        }
        catch (error) {
          this.isLoading.value = false;
          return console.error(error, "Dropped path is not a folder");
        };
        
        await amethyst.player.queue.fetchAsyncData();
      }
      this.isLoading.value = false;
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

  public importSettings = async () => {
    const dialog = await amethyst.showOpenFileDialog({
      filters: [{ name: "Amethyst Configuration File", extensions: ["acf"] }],
      defaultPath: "Amethyst Settings",
    });
  
    if (dialog?.canceled || !dialog.filePaths[0]) return;
  
    const loadedSettings = await fetch(dialog.filePaths[0]);
    const parsedSettings = await loadedSettings.json();
  
    Object.keys(amethyst.state.settings.value).forEach(key => {
      // @ts-ignore
      amethyst.state.settings.value[key] = parsedSettings[key];
    });
  };
  
  public exportSettings = async () => {
    const dialog = await amethyst.showSaveFileDialog({
      filters: [{ name: "Amethyst Configuration File", extensions: ["acf"] }],
      defaultPath: "Amethyst Settings"
    });
    if (dialog?.canceled || !dialog?.filePath) return;
  
    return amethyst.writeFile(JSON.stringify(amethyst.state.settings.value, null, 2), dialog?.filePath);
  };

  public resetSettings = () => {
		Object.keys(this.state.defaultSettings).forEach(key => {
      // @ts-ignore
      this.state.settings.value[key] = this.state.defaultSettings[key];
    });
  };

  public reload = () => {
    location.reload();
  };

  public zoom(action: "in" | "out" | "reset") {
    const currentZoom = amethyst.state.settings.value.zoomLevel;
    let newZoom = currentZoom;

    switch (action) {
      case "in":
        newZoom = currentZoom + .125;
        break;
      case "out":
        newZoom = currentZoom - .125;
        break;
      case "reset":
        newZoom = amethyst.state.defaultSettings.zoomLevel;
        break;
    }

    // Update store with new zoom level
    amethyst.state.settings.value.zoomLevel = newZoom;

    // Set new zoom level
    document.body.style.zoom = newZoom.toString();
  }

  public performWindowAction(action: "close" | "maximize" | "unmaximize" | "minimize" | "fullscreen"): void {
    if (this.getCurrentPlatform() === "desktop") {
      window.electron.ipcRenderer.invoke(action).then(() => this.syncWindowState());
    } else {
      throw new Error(`${this.performWindowAction.name} can only be executed when running in 'desktop' (electron) client`);
    }
  }

  private syncWindowState = async () => {
    const windowState = await window.electron.ipcRenderer.invoke<{ isMinimized: boolean; isMaximized: boolean, isFullscreen: boolean }>("sync-window-state");
    this.state.window.isMinimized = windowState.isMinimized;
    this.state.window.isMaximized = windowState.isMaximized;
    this.state.window.isFullscreen = windowState.isFullscreen;
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
    this.state.window.isCheckingForUpdates = true;
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
    this.state.window.isCheckingForUpdates = false;
  }

}

export const amethyst = new Amethyst();

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
