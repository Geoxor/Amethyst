import { Capacitor } from "@capacitor/core";
import { StatusBar } from "@capacitor/status-bar";
import { NavigationBar } from "@hugotomazi/capacitor-navigation-bar";
import messages from "@intlify/unplugin-vue-i18n/messages";
import { ALLOWED_AUDIO_EXTENSIONS } from "@shared/constants.js";
import { LoadStatus } from "@shared/types.js";
import { useLocalStorage } from "@vueuse/core";
import type { OpenDialogReturnValue, SaveDialogReturnValue } from "electron";
import { ref, watch } from "vue";
import { createI18n } from "vue-i18n";

import { Analytics } from "@/logic/analytics.js";
import { EventEmitter } from "@/logic/eventEmitter.js";
import { flattenArray } from "@/logic/math.js";
import { MediaSourceManager } from "@/logic/mediaSources.js";
import { Player } from "@/logic/player.js";
import { Shortcuts } from "@/logic/shortcuts.js";
import type { Track } from "@/logic/track.js";
import { MediaSession } from "@/modules/mediaSession.js";
import { State } from "@/state.js";

import { getThemeColorHex } from "./logic/color.js";
import { router } from "./router.js";

export const i18n = createI18n({
  fallbackLocale: "en-US", // set fallback locale
  locale: JSON.parse(localStorage.getItem("settings")!)?.application?.language || "en-US",
  messages,
});

export type AmethystPlatforms = ReturnType<typeof amethyst.getCurrentPlatform>;
export const favoriteTracks = useLocalStorage<string[]>("favoriteTracks", []);


const windowEventMap = {
  "window:maximize": undefined as void,
  "window:unmaximize": undefined as void,
  "window:minimize": undefined as void,
  "window:focus": undefined as void,
  "window:unfocus": undefined as void,
} as const;

export type WindowEvents = {
  [K in keyof typeof windowEventMap]: typeof windowEventMap[K];
};

/**
 * Handles interfacing with operating system and unifies methods 
 * to a simple form for all the platforms
 */
export class AmethystBackend extends EventEmitter<WindowEvents>{
  public constructor() {
    super();
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
          const { FilePicker } = await import ('@capawesome/capacitor-file-picker');
          const result = await FilePicker.pickFiles({
            types: ['audio/*'],
          });

          const files = result.files.map(file => Capacitor.convertFileSrc(file.path!));
          
          files ? res({canceled: false, filePaths: files}) : rej();
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
    amethyst.showOpenFileDialog({filters: [{ name: "Audio", extensions: ALLOWED_AUDIO_EXTENSIONS }]}).then(async result => {
      if (result.canceled) return;
      await amethyst.player.queue.add(result.filePaths);
      amethyst.player.queue.fetchAsyncData();
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
  public state: State = new State(this);
  public player = new Player(this);
  public shortcuts: Shortcuts = new Shortcuts();
  public mediaSession: MediaSession | undefined = this.getCurrentPlatform() === "desktop" ? new MediaSession(this.player) : undefined;
  public mediaSourceManager: MediaSourceManager = new MediaSourceManager(this);
  public analytics = new Analytics(this);

  public constructor() {
    super();

    console.log("Amethyst initialized");

    // Init zoom from store
    document.body.style.zoom = this.state.zoomLevel.value.toString();
        
    if (this.getCurrentPlatform() === "desktop") {
      window.electron.ipcRenderer.invoke<string>("get-appdata-path").then(path => this.APPDATA_PATH = path);

      window.electron.ipcRenderer.on("maximize", () => this.emit("window:maximize"));
      window.electron.ipcRenderer.on("unmaximize", () => this.emit("window:unmaximize"));
      window.electron.ipcRenderer.on("minimize", () => this.emit("window:minimize"));
      window.electron.ipcRenderer.on("focus", () => this.emit("window:focus"));
      window.electron.ipcRenderer.on("unfocus", () => this.emit("window:unfocus"));

      this.on("window:maximize", () => this.state.window.isMaximized = true);
      this.on("window:unmaximize", () => this.state.window.isMaximized = false);
      this.on("window:minimize", () => this.state.window.isMinimized = true);
      this.on("window:focus", () => this.state.window.isFocused = true);
      this.on("window:unfocus", () => this.state.window.isFocused = false);

      this.IS_DEV && this.showEventLogs();

      window.electron.ipcRenderer.on("update", () => this.state.window.updateReady = true);

      window.electron.ipcRenderer.on<string>("play-file", path => path !== "--require" && amethyst.player.queue.add(path).then(() => {
        amethyst.player.play(amethyst.player.queue.getList().findIndex(track => track.path == path));
      }));

      window.electron.ipcRenderer.on<(string)[]>("play-folder", paths => amethyst.player.queue.add(flattenArray(paths)));

      // only register native menu listeners on macOS
      if (this.getCurrentOperatingSystem() === "mac") {
        window.electron.ipcRenderer.on("open-settings-native", () => router.push("/settings"));
        window.electron.ipcRenderer.on("open-file-native", () => this.openAudioFilesAndAddToQueue());
        window.electron.ipcRenderer.on("open-folder-native", () => this.openAudioFoldersAndAddToQueue());
        window.electron.ipcRenderer.on("clear-queue-native", () => this.player.queue.clear());
        window.electron.ipcRenderer.on("reload-queue-native", () => this.player.queue.fetchAsyncData(true));
      }
  
      this.state.settings.behavior.fetchMetadataOnStartup && setTimeout(async() => {
        await this.player.queue.fetchAsyncData();
        console.log("fetching data finished, refreshing discovery");
        this.analytics.getDiscoveryTracks();
      }, 1000);
    }

    if (this.getCurrentPlatform() === "mobile") {
      this.initMobile();
    }

    this.handleFileDrops();
    this.handleDiscordRichPresence();

    if (this.state.settings.behavior.autoPlayOnStartup) {
      const track = this.player.queue.getTrack(0);
      track && this.player.play(track);
    }

    this.updateCurrentOutputDevice();
    
  }

  private showEventLogs() {
    for (const event in windowEventMap) {
      this.on(event as keyof WindowEvents, (e) => console.log(`%c[⚐ Window Event]%c ${event}`, "background-color: #00b7ff; color: black; font-weight: bold;", "color:rgb(188, 236, 255);", e));
    }  
  }

  public updateCurrentOutputDevice = async () => {
    const extractDeviceName = (input: string): string => {
      let result = input;
      if (amethyst.getCurrentOperatingSystem() == "windows" ) {
        // Default - Speakers (2- Realtek(R) Audio)
        result = input.slice(input.indexOf("(") + 1, input.lastIndexOf(")"));
      }
      return result;

    };

    let outputDeviceName;

    if (this.state.settings.audio.driver == "default") {
      const mediaDevices = await navigator.mediaDevices?.enumerateDevices();
      navigator.mediaDevices.addEventListener("devicechange", event => {
        if (event.type == "devicechange") {
          this.updateCurrentOutputDevice();
        }
      });
      outputDeviceName = mediaDevices.find(device => device.deviceId == "default" && device.kind == "audiooutput")?.label;
      outputDeviceName && (this.state.settings.audio.outputDeviceName = extractDeviceName(outputDeviceName));
    } else if (this.state.settings.audio.driver == "asio" || this.state.settings.audio.driver == "alsa" || this.state.settings.audio.driver == "coreaudio") {

      // updates on first load unlike the code in outputnode
      this.state.settings.audio.outputDeviceName = this.state.settings.audio.outputRealtimeDeviceName;
    }

    console.log(`Current audio device: ${this.state.settings.audio.outputDeviceName}`);
  };

  private handleDiscordRichPresence() {
    let richPresenceTimer: NodeJS.Timeout | undefined;
    let start: number = 0;
    let startBegin: number = 0;
    let isPaused: boolean = false;
    let seekDuringPause: boolean = false;
    let trackNameBeforePause: string;

    const clearRichPresence = () => {
      richPresenceTimer && clearInterval(richPresenceTimer);
      window.electron.ipcRenderer.invoke("clear-rich-presence");
    };

    const updateRichPresence = async (track: Track) => {
      const sendData = () => {
      const args = [
          track.getArtistsFormatted() && track.getTitleFormatted() ? `${track.getTitleFormatted()}` : track.getFilename(),
          `${track.getArtistsFormatted()} -  ${track.getAlbum()}`,
          start.toString(),
          (track.getDurationSeconds() as number).toString(),
          track.coverUrl,
          track.metadata.data?.format.container?.toLowerCase() || "unknown format",
          isPaused ? "yes" : "no"
        ];
        window.electron.ipcRenderer.invoke("update-rich-presence", [args]);
      };

      richPresenceTimer && clearInterval(richPresenceTimer);
      sendData();
      richPresenceTimer = setInterval(() => sendData(), 5000);
    };

    const updateWithCurrentTrack = async () => {
      if (this.getCurrentPlatform() == "mobile") return;
      const currentTrack = this.player.getCurrentTrack();
      await currentTrack?.fetchAlbumCoverUrl();
      currentTrack && await updateRichPresence(currentTrack);
    };

    if (this.state.settings.integrations.useDiscordRichPresence) {
      this.player.on("player:trackChange", async track => {
        if (isPaused && trackNameBeforePause == track.getTitleFormatted()) {
          start = seekDuringPause ? start : start + Math.abs(Date.now() - startBegin);
        } else {
          start = Date.now();
        }

        seekDuringPause = false;
        isPaused = false;
        trackNameBeforePause = "";
        if (track.metadata.data?.format.container){
          this.IS_DEV && console.log('Metadata is loaded so we can update the rich presence');
          updateWithCurrentTrack();
        } else {
          this.IS_DEV && console.log('Metadata not loaded yet, waiting for it to load...');
          this.player.on("player:currentTrackMetadataLoaded", () => {
            this.IS_DEV && console.log('Metadata loaded updating rich presence');
            this.player.off("player:currentTrackMetadataLoaded");
            updateWithCurrentTrack();
          });
        }
      });

      this.player.on("player:seek", async ({seekedTo}) => {
        start = Date.now() - seekedTo * 1000; 
        if (!isPaused) {
          updateWithCurrentTrack();
        } else {
          seekDuringPause = true;
        }
      });

      this.player.on("player:pause", track => {
        startBegin = Date.now();
        trackNameBeforePause = track.getTitleFormatted() ?? "";
        isPaused = true;
        updateWithCurrentTrack();
      });

      this.player.on("player:stop", () => {
        clearRichPresence();
      });
    };

    watch(() => this.state.settings.integrations.useDiscordRichPresence, value => {
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


      const droppedPath = window.electron.showFilePath(event.dataTransfer!.files[0]!);

      const usableFiles = 
        Array.from(event.dataTransfer!.files)
          .map(file => window.electron.showFilePath(file))
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
  
    Object.keys(amethyst.state.settings).forEach(key => {
      // @ts-ignore
      amethyst.state.settings[key] = parsedSettings[key];
    });
  };
  
  public exportSettings = async () => {
    const dialog = await amethyst.showSaveFileDialog({
      filters: [{ name: "Amethyst Configuration File", extensions: ["acf"] }],
      defaultPath: "Amethyst Settings"
    });
    if (dialog?.canceled || !dialog?.filePath) return;
  
    return amethyst.writeFile(JSON.stringify(amethyst.state.settings, null, 2), dialog?.filePath);
  };

  public resetSettings = () => {
    localStorage.removeItem("settings");
		Object.keys(this.state.defaultSettings).forEach(key => {
      // @ts-ignore
      this.state.settings[key] = this.state.defaultSettings[key];
    });
  };

  public reload = () => {
    location.reload();
  };

  public zoom(action: "in" | "out" | "reset") {
    const currentZoom = amethyst.state.zoomLevel.value;
    let newZoom = currentZoom;

    switch (action) {
      case "in":
        newZoom = currentZoom + .125;
        break;
      case "out":
        newZoom = currentZoom - .125;
        break;
      case "reset":
        newZoom = 1.0;
        break;
    }

    // Update store with new zoom level
    amethyst.state.zoomLevel.value = newZoom;

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

  public async updateMobileAppColors() {
    await StatusBar.setBackgroundColor({color: getThemeColorHex('--surface-900') || '#0f1119'});
    await NavigationBar.setColor({color: getThemeColorHex('--surface-700') || '#181a27'});
  }

  private async initMobile() {
    this.updateMobileAppColors()
    this.state.on("theme:change", () => this.updateMobileAppColors())
  }

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

  public shouldPauseAnimations(): boolean {
    return !this.state.window.isFocused && this.state.settings.performance.pauseVisualsWhenUnfocused;
  }

  public shouldPauseVisualizers(): boolean {
    return this.shouldPauseAnimations() || this.player.isPaused.value;
  }

}

// this is to not reinitialize the Amethyst class on hot reload
let globalAmethyst = globalThis.__amethyst__;

if (!globalAmethyst) {
  globalAmethyst = new Amethyst();
  globalThis.__amethyst__ = globalAmethyst;
}

export const amethyst = globalAmethyst;

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
