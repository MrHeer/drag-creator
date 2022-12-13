import { Position, Boundary } from "./types";

export function getPositionFromEvent(evt: MouseEvent): Position {
  const { x, y } = evt;
  return { x, y };
}

export function getBoundaryWithAspectRadio(
  boundary: Boundary,
  aspectRatio: number
): Boundary {
  const { start, end } = boundary;
  // update end.x to guarantee aspect ratio
  const endX = start.x + aspectRatio * (end.y - start.y);
  return {
    start,
    end: { x: endX, y: end.y },
  };
}
