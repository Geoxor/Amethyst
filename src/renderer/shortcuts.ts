import { useElectron } from "@/amethyst";
import type { Player } from "@/player";
import { onKeyStroke, useKeyModifier, useLocalStorage } from "@vueuse/core";

export type ShortcutBindings = Record<string, [string[], (e: KeyboardEvent) => void]>;
export type CustomShortcutBindings = Record<string, string[]>;

export class Shortcuts {
  private isControlPressed = useKeyModifier("Control");
  private isShiftPressed = useKeyModifier("Shift");
  private isAltPressed = useKeyModifier("Alt");

  public DEFAULT_BINDINGS: ShortcutBindings = {
    "audio.play.pause": [[" "], () => this.player.isPlaying() ? this.player.pause() : this.player.play()],
    "audio.next": [["ArrowDown"], () => this.player.next()],
    "audio.previous": [["ArrowUp"], () => this.player.previous()],
    "audio.seek.forward": [["ArrowRight"], () => this.player.seekForward()],
    "audio.seek.backward": [["ArrowLeft"], () => this.player.seekBackward()],
    "audio.volume.up": [["PageUp"], () => this.player.volumeUp()],
    "audio.volume.down": [["PageDown"], () => this.player.volumeDown()],
    "queue.remove.item": [["Delete"], () => this.player.removeCurrentItemFromQueue()],
    "queue.add.file": [["o"], () => this.isControlPressed.value && useElectron().openFileDialog()],
    "queue.add.folder": [["O"], () => this.isControlPressed.value && useElectron().openFolderDialog()],
    "queue.clear": [["X"], () => this.isControlPressed.value && this.player.clearQueue()],
    "song.favorite": [["f"], () => this.player.favoriteToggle(this.player.getCurrentlyPlayingFilePath())],
  };

  public bindings = this.DEFAULT_BINDINGS;
  public customBindings = useLocalStorage<CustomShortcutBindings>("customShortcuts", {}).value;

  constructor(public player: Player) {
    this.registerShortcuts();
  }

  public registerShortcuts() {
    for (let i = 0; i < Object.entries(this.bindings).length; i++) {
      const [actionName] = Object.entries(this.bindings)[i];
      const [defaultKeys, action] = this.bindings[actionName];

      // Get the user config keys
      const customKeys = this.customBindings[actionName];

      // Replace the defaults with the user's options
      const keys = customKeys || defaultKeys;

      // Register the event for each key
      for (let j = 0; j < keys.length; j++)
        onKeyStroke(keys[j], e => {
          e.stopPropagation();
          action(e);
        });
    }
  }
}
