import Konva from "konva";
import React, { useState } from "react";
import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";
import reactURL from "./assets/react.svg";
import { Boundary, useDragCreator } from "../lib/main";

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function boundary2Rect(boundary: Boundary): Rect {
  return {
    x: boundary.start.x,
    y: boundary.start.y,
    width: boundary.end.x - boundary.start.x,
    height: boundary.end.y - boundary.start.y,
  };
}

export const App = () => {
  const [svg] = useImage(reactURL);
  const [images, setImages] = useState<Konva.ImageConfig[]>([]);
  const [boundary, setBoundary] = useState<Boundary>({
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  });
  const [style, setStyle] = useState<React.CSSProperties>({});

  const {
    state,
    prepareCreate,
    mouseDownHandler,
    mouseMoveHandler,
    mouseUpHandler,
  } = useDragCreator({
    onBegin: setBoundary,
    onCreating: setBoundary,
    onFinish: (boundary) => {
      setStyle({ cursor: "default" });
      setImages((prev) => [
        ...prev,
        {
          ...boundary2Rect(boundary),
          image: svg,
          key: prev.length + 1,
        },
      ]);
    },
  });

  return (
    <>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        style={style}
        onMouseDown={(evt) => mouseDownHandler(evt.evt)}
        onMouseMove={(evt) => mouseMoveHandler(evt.evt)}
        onMouseUp={(evt) => mouseUpHandler(evt.evt)}
      >
        <Layer>
          {images.map((config) => (
            <Image
              draggable
              onMouseEnter={() => setStyle({ cursor: "pointer" })}
              onMouseLeave={() => setStyle({ cursor: "default" })}
              {...config}
            />
          ))}
          {state === "creating" && (
            <Image {...boundary2Rect(boundary)} stroke="#82b6fe" image={svg} />
          )}
        </Layer>
      </Stage>

      <button
        style={{ position: "absolute", left: 12, top: 12 }}
        onClick={() => {
          setStyle({ cursor: "crosshair" });
          prepareCreate();
        }}
      >
        Create React SVG
      </button>
      <button
        style={{ position: "absolute", left: 240, top: 12 }}
        onClick={() => {
          setImages([]);
        }}
      >
        Clear
      </button>
    </>
  );
};

export default App;
