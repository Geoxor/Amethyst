import { AmethystAudioNode } from "@/logic/audio";
import { Track } from "@/logic/track";
import { reactive } from "vue";
import InspectorBar from "./InspectorBar.vue";

export const getInspectableItemType = (item: any) => {
  if (item instanceof Track) return "track";
  if (item instanceof AmethystAudioNode) return "node";
  return;
};

const instance = {
  state: reactive({
    currentItem: undefined as any,
    isVisible: false,
  }),
  inspectAndShow: (item: Track) => {
    instance.inspect(item);
    instance.show();
  },
  inspect: (item: Track) => {
    instance.state.currentItem = item;
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
