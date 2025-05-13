import type { UseKeyModifierReturn} from "@vueuse/core";
import { onKeyStroke, useKeyModifier, useLocalStorage } from "@vueuse/core";
import { computed } from "vue";

import { amethyst } from "@/amethyst.js";

export type ShortcutBindings = Record<string, [string[], (e: KeyboardEvent) => void]>;
export type CustomShortcutBindings = Record<string, string[]>;

// Stops default HTML actions like scrolling when tapping space or seeking with pageup/down after clicking the seekbar
window.addEventListener("keydown", function(e) {
  switch (e.code) {
    case "Space":
    case "PageDown":
    case "PageUp":
    case "ArrowDown":
    case "ArrowUp":
      e.preventDefault();
      break;
  }
});

export class Shortcuts {
  public isControlPressed = useKeyModifier("Control") as UseKeyModifierReturn<boolean>;
  public isCommandPressed = useKeyModifier("Meta") as UseKeyModifierReturn<boolean>;
  public isCommandOrControlPressed = computed(() => this.isCommandPressed.value || this.isControlPressed.value);
  public isShiftPressed = useKeyModifier("Shift") as UseKeyModifierReturn<boolean>;
  public isAltPressed = useKeyModifier("Alt") as UseKeyModifierReturn<boolean>;

  // TODO: somehow link this logic to each function in the components so they render automatically in dropdown menus
  public DEFAULT_BINDINGS: ShortcutBindings = {
    // please name these keys in the following syntax
    // <noun>.<verb>.<name>
    "audio.play.pause": [[" "], () => amethyst.player.isPlaying.value ? amethyst.player.pause() : amethyst.player.play()],
    "audio.next": [["ArrowDown"], () => amethyst.player.skip()],
    "audio.previous": [["ArrowUp"], () => amethyst.player.previous()],
    "audio.seek.forward": [["ArrowRight"], () => amethyst.player.seekForward()],
    "audio.seek.backward": [["ArrowLeft"], () => amethyst.player.seekBackward()],
    "audio.volume.up": [["PageUp"], () => amethyst.player.volumeUp()],
    "audio.volume.down": [["PageDown"], () => amethyst.player.volumeDown()],
    "queue.add.file": [["o"], () => this.isCommandOrControlPressed.value && amethyst.openAudioFilesAndAddToQueue()],
    "queue.add.folder": [["O"], () => this.isCommandOrControlPressed.value && amethyst.openAudioFoldersAndAddToQueue()],
    "queue.clear": [["X"], () => this.isCommandOrControlPressed.value && amethyst.player.queue.clear()],
    "queue.clear.errored": [["Z"], () => this.isCommandOrControlPressed.value && amethyst.player.queue.clearErrored()],
    "queue.refresh.meta": [["r"], () => this.isCommandOrControlPressed.value && this.isAltPressed.value && amethyst.player.queue.fetchAsyncData(true)],
    "appearance.toggle.playback_controls": [["F10"], () => amethyst.state.settings.appearance.showPlaybackControls = !amethyst.state.settings.appearance.showPlaybackControls],
    "appearance.toggle.debug_statistics": [["F9"], () => amethyst.state.settings.appearance.showDebugStats = !amethyst.state.settings.appearance.showDebugStats],
    "interface.zoom.in": [["+"], () => this.isCommandOrControlPressed.value && amethyst.zoom("in")],
    "interface.zoom.out": [["-"], () => this.isCommandOrControlPressed.value && amethyst.zoom("out")],
    "interface.zoom.reset": [["0"], () => this.isCommandOrControlPressed.value && amethyst.zoom("reset")],
    "interface.reload": [["F5"], () => amethyst.reload()],
    "interface.navigate.settings": [[","], () => this.isCommandOrControlPressed.value && amethyst.openSettings()],
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
