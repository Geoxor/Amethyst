import ResizableDiv from "./component.vue";

export type Side = "left" | "right" | "top" | "bottom";
export type Direction = "horizontal" | "vertical";

export function getResizeDirection(side: Side): Direction {
  return side === "left" || side === "right" ? "vertical" : "horizontal";
}

export default ResizableDiv;
