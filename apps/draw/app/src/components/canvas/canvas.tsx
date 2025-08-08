import { useRef } from "react";
import { PannableCanvasKit } from "./pan";

export const Canvas = () => {
  const apiRef = useRef<{
    panTo: (x: number, y: number) => void;
    zoomTo: (scale: number, center?: { x: number; y: number }) => void;
    getView: () => { x: number; y: number; scale: number };
  }>(null);

  return (
    <div>
      <PannableCanvasKit
        ref={apiRef}
        width={800}
        height={600}
        initialScale={1}
        draw={(ctx, view) => {
          ctx.fillStyle = "red";
          ctx.fillRect(0, 0, 100, 100);
        }}
      />

      <button
        onClick={() => apiRef.current?.panTo(200, 150)}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Pan to (200, 150)
      </button>

      <button
        onClick={() => apiRef.current?.zoomTo(2)}
        className="ml-2 p-2 bg-green-500 text-white rounded"
      >
        Zoom to 2x
      </button>
    </div>
  );
}