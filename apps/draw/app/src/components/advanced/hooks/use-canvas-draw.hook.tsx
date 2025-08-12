// useCanvasDrawing.ts
import { useEffect } from "react";
import { DrawFunction } from "../models";
import { CanvasKit } from "canvaskit-wasm";

export function useCanvasDrawing(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  canvasKit: CanvasKit | null,
  view: { x: number; y: number; scale: number },
  draw: DrawFunction
) {
  useEffect(() => {
    if (!canvasKit || !canvasRef.current) return;

    const surface = canvasKit.MakeWebGLCanvasSurface(canvasRef.current);
    if (!surface) return;

    const canvas = surface.getCanvas();
    canvas.clear(canvasKit.TRANSPARENT);

    canvas.save();
    canvas.translate(view.x, view.y);
    canvas.scale(view.scale, view.scale);

    draw(canvas, canvasKit);

    canvas.restore();
    surface.flush();

    return () => {
      surface.dispose();
    };
  }, [canvasKit, view, draw]);
}
