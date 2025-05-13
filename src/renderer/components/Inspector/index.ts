import { reactive } from "vue";

import type { AmethystAudioNode } from "@/logic/audio.js";
import type { Track } from "@/logic/track.js";

import InspectorBar from "./InspectorBar.vue";

const instance = {
  state: reactive<{currentItem: Record<string, Track | AmethystAudioNode> | undefined, isVisible: boolean}>({
    currentItem: undefined,
    isVisible: false,
  }),
  inspectAndShow: (item: Track | AmethystAudioNode) => {
    instance.inspect(item);
    instance.show();
  },
  inspect: (item: Track | AmethystAudioNode) => {
    instance.state.currentItem = item as any;
  },
  toggleVisability: () => {
    instance.state.isVisible = !instance.state.isVisible;
  },
  show: () => {
    instance.state.isVisible = true;
  },
  hide: () => {
    instance.state.isVisible = false;
  }
};

export {
  InspectorBar
};

export const useInspector = () => instance;
