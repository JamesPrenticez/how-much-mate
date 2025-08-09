import { useEffect } from "react";

export const useCanvasZoom = (
  enableZoom: boolean,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  viewRef: React.RefObject<{ x: number; y: number; scale: number }>,
  wheelZoomFactor: number,
  minZoom: number,
  maxZoom: number,
  drawFrame: () => void,
  clamp: (val: number, min: number, max: number) => number
) => {
  useEffect(() => {
    if (!enableZoom) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault();

      const { scale, x, y } = viewRef.current!;

      const rect = canvas.getBoundingClientRect();
      const mouseX = ev.clientX - rect.left;
      const mouseY = ev.clientY - rect.top;

      const worldMouseX = (mouseX - x) / scale;
      const worldMouseY = (mouseY - y) / scale;

      const zoomAmount = 1 - ev.deltaY * wheelZoomFactor;
      let newScale = scale * zoomAmount;
      newScale = clamp(newScale, minZoom, maxZoom);

      const newX = mouseX - worldMouseX * newScale;
      const newY = mouseY - worldMouseY * newScale;

      viewRef.current!.x = newX;
      viewRef.current!.y = newY;
      viewRef.current!.scale = newScale;

      drawFrame();
    };

    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheel);
  }, [enableZoom, wheelZoomFactor, minZoom, maxZoom, drawFrame, clamp]);
}