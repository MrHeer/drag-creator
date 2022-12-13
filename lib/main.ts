import { useCallback, useRef, useState } from "react";
import { DragCreatorProps, DragCreatorReturn, Position, State } from "./types";
import { getBoundaryWithAspectRadio, getPositionFromEvent } from "./utils";

export function useDragCreator({
  onBegin,
  onCreating,
  onFinish,
}: DragCreatorProps): DragCreatorReturn {
  const [state, setState] = useState<State>("none");
  const startPositionRef = useRef<Position>({ x: 0, y: 0 });
  const aspectRatioRef = useRef(1);

  const prepareCreate = useCallback((aspectRatio = 1) => {
    setState("prepared");
    aspectRatioRef.current = aspectRatio;
  }, []);

  const finishCreate = useCallback(() => {
    setState("none");
  }, []);

  const mouseDownHandler = useCallback(
    (evt: MouseEvent) => {
      if (state !== "prepared") return;
      setState("creating");
      const start = getPositionFromEvent(evt);
      startPositionRef.current = start;
      onBegin?.({
        start,
        end: start,
      });
    },
    [state, onBegin]
  );

  const mouseMoveHandler = useCallback(
    (evt: MouseEvent) => {
      if (state !== "creating") return;

      const boundary = calcBoundary(evt);
      onCreating?.(boundary);
    },

    [state, onCreating]
  );

  const mouseUpHandler = useCallback(
    (evt: MouseEvent) => {
      if (state !== "creating") return;
      setState("none");

      const boundary = calcBoundary(evt);
      onFinish?.(boundary);
    },
    [state, onFinish]
  );

  const calcBoundary = (evt: MouseEvent) => {
    const start = startPositionRef.current;
    const end = getPositionFromEvent(evt);

    const aspectRatioMode = evt.shiftKey;
    if (aspectRatioMode)
      return getBoundaryWithAspectRadio({ start, end }, aspectRatioRef.current);
    return { start, end };
  };

  return {
    state,
    prepareCreate,
    finishCreate,
    mouseDownHandler,
    mouseMoveHandler,
    mouseUpHandler,
  };
}

export * from "./types";
