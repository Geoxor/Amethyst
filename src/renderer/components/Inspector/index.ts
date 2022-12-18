import { Track } from "@/logic/track";
import { reactive } from "vue";
import InspectorBar from "./InspectorBar.vue";

const instance = {
  state: reactive({
    currentItem: undefined as any,
    isVisible: false,
  }),
  inspect: (item: Track) => {
    instance.state.isVisible = true;
    instance.state.currentItem = item;
  }
};

export {
  InspectorBar
};

export const useInspector = () => instance;
