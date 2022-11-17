import { ElectronEventManager } from "@/electronEventManager";
import { Player } from "@/logic/player";
import { Shortcuts } from "@/shortcuts";
import { AppState } from "@/state";
import { watch } from "vue";
import { flattenArray } from "./logic/math";
import { Track } from "@/logic/track";
import { MediaSession } from "@/mediaSession";
import { CPUUsageMonitor } from "@/logic/CPUUsageMonitor";

export class Amethyst {
  public appState: AppState = new AppState();
  public electron: ElectronEventManager = new ElectronEventManager(this.appState);
  public player: Player = new Player();
  public shortcuts: Shortcuts = new Shortcuts(this.player);
  public mediaSession: MediaSession = new MediaSession(this.player);
  public cpuUsageMonitor: CPUUsageMonitor = new CPUUsageMonitor(this.appState, this.electron);

  private richPresenceTimer: NodeJS.Timer | undefined;

  constructor() {
		this.electron.ipc.on<string>("play-file", path => path !== "--require" && this.player.queue.add(path));
    this.electron.ipc.on<(string)[]>("play-folder", paths => this.player.queue.add(flattenArray(paths)));

    watch(() => this.appState.settings.useDiscordRichPresence, value => {
      if (value) {
        const currentTrack = this.player.getCurrentTrack();
        currentTrack && this.updateRichPresence(currentTrack);
        return;
      };
      this.richPresenceTimer && clearInterval(this.richPresenceTimer);
      this.electron.clearRichPresence();
    });

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

    this.player.on("play", track => {
      if (this.appState.settings.useDiscordRichPresence) {
        this.updateRichPresence(track);
      }
   });
  }

  private updateRichPresence(track: Track){
    const sendData = () => {
      this.electron.updateRichPresence([
        `${track.getArtistsFormatted() || "unknown artist"} - ${track.getTitleFormatted() || "unknown title"}`,
        track.getDurationFormatted(true),
        this.player.currentTimeFormatted(true),
        this.player.isPlaying.value.toString(),
      ]);
    };
    this.richPresenceTimer && clearInterval(this.richPresenceTimer);
    sendData();
    this.richPresenceTimer = setInterval(() => sendData(), 1000);
  }
}

const amethyst = new Amethyst();

export const useState = () => amethyst.appState;
export const useElectron = () => amethyst.electron;
export const useShortcuts = () => amethyst.shortcuts;
export const usePlayer = () => amethyst.player;
