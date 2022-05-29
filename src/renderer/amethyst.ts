import ElectronEventManager from "./electronEventManager";
import Player from "./player";
import Shortcuts from "./shortcuts";
import AppState from "./state";

export class Amethyst {
  public appState: AppState = new AppState();
	public electron: ElectronEventManager = new ElectronEventManager(this.appState);
  public player: Player = new Player(this.appState, this.electron);
  public shortcuts: Shortcuts = new Shortcuts(this.player);

  constructor() {
    document.addEventListener("drop", (event) => {
      event.preventDefault();
      event.stopPropagation();

      // for (const f of Array.from(event.dataTransfer!.files)) {
      //     console.log("File Path of dragged files: ", f);
      //     this.player.addToQueueAndPlay(f.path);
      // }

      this.electron.invoke("drop-file", [Array.from(event.dataTransfer!.files).map(f => f.path)]);
    });

    document.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    // document.addEventListener("dragenter", (event) => {
    //   console.log("File is in the Drop Space");
    // });

    // document.addEventListener("dragleave", (event) => {
    //   console.log("File has left the Drop Space");
    // });
  }
}

const amethyst = new Amethyst();

export const useState = () => amethyst.appState;
export const useElectron = () => amethyst.electron;
export const useShortcuts = () => amethyst.shortcuts;
export const usePlayer = () => amethyst.player;
