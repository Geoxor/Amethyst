import ElectronEventManager from "@/electronEventManager";
import MediaSession from "@/mediaSession";
import Player from "@/player";
import Shortcuts from "@/shortcuts";
import AppState from "@/state";

export class CPUUsageMonitor {
  public timer: NodeJS.Timer | undefined;

  constructor(public state: AppState, public electron: ElectronEventManager) {
    this.start();
  }

  public stop = () => {
    this.timer && clearInterval(this.timer);
  };

  public start = () => {
    this.timer = setInterval(() => this.getCpuData(), 1000);
  };

  private getCpuData = async () => {
    this.electron.invoke("percent-cpu-usage")
      .then((usage) => this.state.state.cpuUsage = usage as number)
      .catch((err) => console.log("Failed to get CPU usage", err));
  };
}

export class Amethyst {
  public appState: AppState = new AppState();
  public electron: ElectronEventManager = new ElectronEventManager(this.appState);
  public player: Player = new Player(this.appState, this.electron);
  public shortcuts: Shortcuts = new Shortcuts(this.player);
  public mediaSession: MediaSession = new MediaSession(this.player);
  public cpuUsageMonitor: CPUUsageMonitor = new CPUUsageMonitor(this.appState, this.electron);

  constructor() {
    document.addEventListener("drop", (event) => {
      event.preventDefault();
      event.stopPropagation();

      this.electron.invoke("drop-file", [Array.from(event.dataTransfer!.files).map(f => f.path)]);
    });

    document.addEventListener("dragover", (e) => {
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
