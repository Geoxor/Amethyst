import { useElectron } from "@/amethyst";
import { player } from "@/logic/player";
import { onKeyStroke, useKeyModifier, UseKeyModifierReturn, useLocalStorage } from "@vueuse/core";

export type ShortcutBindings = Record<string, [string[], (e: KeyboardEvent) => void]>;
export type CustomShortcutBindings = Record<string, string[]>;

export class Shortcuts {
  public isControlPressed = useKeyModifier("Control") as UseKeyModifierReturn<boolean>;
  public isShiftPressed = useKeyModifier("Shift") as UseKeyModifierReturn<boolean>;
  public isAltPressed = useKeyModifier("Alt") as UseKeyModifierReturn<boolean>;

  // TODO: somehow link this logic to each function in the components so they render automatically in dropdown menus
  public DEFAULT_BINDINGS: ShortcutBindings = {
    "audio.play.pause": [[" "], () => player.isPlaying.value ? player.pause() : player.play()],
    "audio.next": [["ArrowDown"], () => player.skip()],
    "audio.previous": [["ArrowUp"], () => player.previous()],
    "audio.seek.forward": [["ArrowRight"], () => player.seekForward()],
    "audio.seek.backward": [["ArrowLeft"], () => player.seekBackward()],
    "audio.volume.up": [["PageUp"], () => player.volumeUp()],
    "audio.volume.down": [["PageDown"], () => player.volumeDown()],
    "queue.add.file": [["o"], () => this.isControlPressed.value && useElectron().openFileDialog()],
    "queue.add.folder": [["O"], () => this.isControlPressed.value && useElectron().openFolderDialog()],
    "queue.clear": [["X"], () => this.isControlPressed.value && player.queue.clear()],
    "queue.clear.errored": [["Z"], () => this.isControlPressed.value && player.queue.clearErrored()],
    "queue.force.refresh.meta": [["r"], () => this.isControlPressed.value && this.isAltPressed.value && player.queue.fetchAsyncData(true)]
  };

  public bindings = this.DEFAULT_BINDINGS;
  public customBindings = useLocalStorage<CustomShortcutBindings>("customShortcuts", {}).value;

  public constructor() {
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
