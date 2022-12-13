export type State = "none" | "prepared" | "creating";

export type Position = {
  x: number;
  y: number;
};

export type Boundary = {
  start: Position;
  end: Position;
};

export interface DragCreatorProps {
  onBegin?: (boundary: Boundary) => void;
  onCreating?: (boundary: Boundary) => void;
  onFinish?: (boundary: Boundary) => void;
}

export interface DragCreatorReturn {
  state: State;
  /**
   * @description update state to prepared.
   * @param aspectRatio the ratio of its width to its height
   */
  prepareCreate: (aspectRatio?: number) => void;
  finishCreate: () => void;
  mouseDownHandler: (evt: MouseEvent) => void;
  mouseMoveHandler: (evt: MouseEvent) => void;
  mouseUpHandler: (evt: MouseEvent) => void;
}
