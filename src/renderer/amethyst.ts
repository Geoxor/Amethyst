import { ElectronEventManager } from "@/electronEventManager";
import { Player } from "@/logic/player";
import { Shortcuts } from "@/shortcuts";
import { AppState } from "@/state";
import { flattenArray } from "./logic/math";
import { MediaSession } from "./mediaSession";

export class BackendLogger {
  public print = (...messages: any[]) => this.electron.logPrint(messages);
  public error = (...messages: any[]) => this.electron.logError(messages);
  constructor(public electron: ElectronEventManager) {}
}

export class CPUUsageMonitor {
  public timer: NodeJS.Timer | undefined;

  constructor(public state: AppState, public electron: ElectronEventManager, public logger: BackendLogger) {
    this.start();
  }

  public stop = () => {
    this.timer && clearInterval(this.timer);
  };

  public start = () => {
    this.timer = setInterval(() => this.getCpuData(), 1000);
  };

  private getCpuData = async () => {
    this.electron.getCpuUsage()
      .then(usage => this.state.state.cpuUsage = usage as number)
      .catch(this.logger.error);
  };
}

export class Amethyst {
  public appState: AppState = new AppState();
  public electron: ElectronEventManager = new ElectronEventManager(this.appState);
  public backendLogger: BackendLogger = new BackendLogger(this.electron);
  public player: Player = new Player();
  public shortcuts: Shortcuts = new Shortcuts(this.player);
  public mediaSession: MediaSession = new MediaSession(this.player, this.backendLogger);
  public cpuUsageMonitor: CPUUsageMonitor = new CPUUsageMonitor(this.appState, this.electron, this.backendLogger);

  constructor() {
		this.electron.ipc.on<string>("play-file", path => path !== "--require" && this.player.queue.add(path));
    this.electron.ipc.on<(string)[]>("play-folder", paths => this.player.queue.add(flattenArray(paths)));

    document.addEventListener("drop", event => {
      event.preventDefault();
      event.stopPropagation();
      this.player.queue.add(Array.from(event.dataTransfer!.files).map(f => f.path));
    });

    document.addEventListener("dragover", e => {
      e.preventDefault();
      e.stopPropagation();
    });

    this.player.on("*", console.log);
  }
}

const amethyst = new Amethyst();

export const useState = () => amethyst.appState;
export const useElectron = () => amethyst.electron;
export const useShortcuts = () => amethyst.shortcuts;
export const usePlayer = () => amethyst.player;
