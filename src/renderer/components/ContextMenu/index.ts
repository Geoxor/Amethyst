import { IContextMenuOption } from "@/state";
import { Coords } from "@shared/types";
import { reactive, markRaw } from "vue";
import ContextMenu from "./component.vue";
import { amethyst } from "@/amethyst";

const instance = {
  state: reactive({
    isVisible: false,
    position: {
      x: 0,
      y: 0,
    },
    options: [] as IContextMenuOption[],
  }),
  open: ({x, y}: Coords, options: IContextMenuOption[]) => {
    instance.state.position = { x: x / amethyst.store.settings.value.zoomLevel + 6, y: y / amethyst.store.settings.value.zoomLevel + 6 };
    instance.state.options = markRaw(options);
    instance.state.isVisible = true;
  }
};

export const useContextMenu = () => instance;

export {
  ContextMenu
};