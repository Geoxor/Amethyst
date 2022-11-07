import { ElectronEventManager } from "@/electronEventManager";
import { Player } from "@/player";
import { Shortcuts } from "@/shortcuts";
import { AppState } from "@/state";
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
  public player: Player = new Player(this.appState, this.electron, this.backendLogger);
  public shortcuts: Shortcuts = new Shortcuts(this.player);
  public mediaSession: MediaSession = new MediaSession(this.player, this.backendLogger);
  public cpuUsageMonitor: CPUUsageMonitor = new CPUUsageMonitor(this.appState, this.electron, this.backendLogger);

  constructor() {
    document.addEventListener("drop", event => {
      event.preventDefault();
      event.stopPropagation();

      this.electron.dropFiles(Array.from(event.dataTransfer!.files).map(f => f.path));
    });

    document.addEventListener("dragover", e => {
      e.preventDefault();
      e.stopPropagation();
    });
  }
}

const amethyst = new Amethyst();

export const useState = () => amethyst.appState;
export const useElectron = () => amethyst.electron;
export const useShortcuts = () => amethyst.shortcuts;
export const usePlayer = () => amethyst.player;
