import { ElectronEventManager } from "@/electronEventManager";
import { CPUUsageMonitor } from "@/logic/CPUUsageMonitor";
import { player } from "@/logic/player";
import { Track } from "@/logic/track";
import { MediaSession } from "@/mediaSession";
import { Shortcuts } from "@/shortcuts";
import { Store } from "@/state";
import { watch } from "vue";
import { flattenArray } from "./logic/math";
import {Buffer} from "buffer";

export class Amethyst {
  public store: Store = new Store();
  public electron: ElectronEventManager = new ElectronEventManager(this.store.state);
  public shortcuts: Shortcuts = new Shortcuts();
  public mediaSession: MediaSession = new MediaSession();
  public cpuUsageMonitor: CPUUsageMonitor = new CPUUsageMonitor(this.store, this.electron);
  
  private richPresenceTimer: NodeJS.Timer | undefined;

  constructor() {
		this.electron.ipc.on<string>("play-file", path => path !== "--require" && player.queue.add(path).then(() => {
      player.play(player.queue.getList().findIndex(track => track.path == path));
    }));
    this.electron.ipc.on<(string)[]>("play-folder", paths => player.queue.add(flattenArray(paths)));

    watch(() => this.store.settings.useDiscordRichPresence, value => {
      if (value) {
        const currentTrack = player.getCurrentTrack();
        currentTrack && this.updateRichPresence(currentTrack);
        return;
      };
      this.richPresenceTimer && clearInterval(this.richPresenceTimer);
      this.electron.clearRichPresence();
    });

    document.addEventListener("drop", event => {
      event.preventDefault();
      event.stopPropagation();
      player.queue.add(Array.from(event.dataTransfer!.files).map(f => f.path));
      player.play(player.queue.getList()[ player.queue.getList().length - 1]);
    });

    document.addEventListener("dragover", e => {
      e.preventDefault();
      e.stopPropagation();
    });

    player.on("play", track => {
      if (this.store.settings.useDiscordRichPresence) {
        this.updateRichPresence(track);
      }
    });
  }

  private updateRichPresence(track: Track){
    const sendData = () => {
      this.electron.updateRichPresence([
        `${track.getArtistsFormatted() || "unknown artist"} - ${track.getTitleFormatted() || "unknown title"}`,
        player.isPaused.value ? "Paused" : `${player.currentTimeFormatted(true)} - ${track.getDurationFormatted(true)}`,
        track.metadata.data?.format.container?.toLowerCase()
      ]);
    };

    this.richPresenceTimer && clearInterval(this.richPresenceTimer);
    sendData();
    this.richPresenceTimer = setInterval(() => sendData(), 1000);
  }
}

const amethyst = new Amethyst();

export const useState = () => amethyst.store;
export const useElectron = () => amethyst.electron;
export const useShortcuts = () => amethyst.shortcuts;
export const useFs = () => ({
  save: async (data: string | NodeJS.ArrayBufferView) => {
    const {canceled, filePath} = await useElectron().showSaveDialog();
    if (canceled) return;
    return window.fs.writeFile(filePath, data, {encoding: "utf8"});
  },
  open: async () => {
    const {canceled, filePath} = await useElectron().openFileDialog();
    if (canceled) return;
    return Buffer.from(await window.fs.readFile(filePath));
  }
});

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
