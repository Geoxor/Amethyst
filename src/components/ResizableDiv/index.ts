import ResizableDiv from "./component.vue";

export type Direction = "horizontal" | "vertical";
export type ResizeSide = "left" | "right" | "top" | "bottom" | "centerHorizontal" | "centerVertical";

export function getResizeDirection(side: ResizeSide): Direction {
  switch (side) {
    case "left":
    case "right":
    case "centerVertical":
      return "vertical";
    case "top":
    case "bottom":
    case "centerHorizontal":
      return "horizontal";
  }
}

export default ResizableDiv;
