import { useEffect } from 'react';

export const useCanvasPan = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  pointerActiveRef: React.MutableRefObject<boolean>,
  lastPointerPos: React.MutableRefObject<{ x: number; y: number } | null>,
  viewRef: React.RefObject<{ x: number; y: number; scale: number }>,
  drawFrame: () => void
) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onPointerDown = (ev: PointerEvent) => {
      pointerActiveRef.current = true;
      try {
        canvas.setPointerCapture(ev.pointerId);
      } catch (error) {
        console.warn('Failed to set pointer capture:', error);
      }
      lastPointerPos.current = { x: ev.clientX, y: ev.clientY };
    };

    const onPointerMove = (ev: PointerEvent) => {
      if (!pointerActiveRef.current || !lastPointerPos.current) return;

      const dx = ev.clientX - lastPointerPos.current.x;
      const dy = ev.clientY - lastPointerPos.current.y;
      lastPointerPos.current = { x: ev.clientX, y: ev.clientY };

      viewRef.current!.x += dx;
      viewRef.current!.y += dy;

      drawFrame();
    };

    const onPointerUp = (ev: PointerEvent) => {
      pointerActiveRef.current = false;
      try {
        canvas.releasePointerCapture(ev.pointerId);
      } catch (error) {
        console.warn('Failed to release pointer capture:', error);
      }
      lastPointerPos.current = null;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [drawFrame]);
}
