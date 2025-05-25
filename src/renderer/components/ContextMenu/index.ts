import type { Coords } from "@shared/types.js";
import { markRaw,reactive } from "vue";

import { amethyst } from "@/amethyst.js";
import type { IContextMenuOption } from "@/state.js";

import ContextMenu from "./component.vue";

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
    instance.state.position = { x: x / amethyst.state.zoomLevel.value + 6, y: y / amethyst.state.zoomLevel.value + 6 };
    instance.state.options = markRaw(options);
    instance.state.isVisible = true;
  }
};

export const useContextMenu = () => instance;

export {
  ContextMenu
};