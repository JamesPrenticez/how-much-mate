import { useCallback, useRef } from "react";
import { useCanvasStore } from "../stores";
import { clamp, screenToWorld } from "../utils";
import { initialConfig } from "../config";
import { useSharedRAF } from './use-canvas-raf';

export function useZoom() {
  const view = useCanvasStore((s) => s.view);
  const setView = useCanvasStore((s) => s.setView);
  const latestEvent = useRef<React.WheelEvent | null>(null);
  const { scheduleUpdate } = useSharedRAF();

  const processZoom = useCallback(() => {
    if (!latestEvent.current) return;

    const e = latestEvent.current;
    const delta = -e.deltaY * initialConfig.zoomSpeed;
    const newScale = clamp(view.scale * (1 + delta), initialConfig.minZoom, initialConfig.maxZoom);

    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldBeforeZoom = screenToWorld(mouseX, mouseY, view);

    setView({
      scale: newScale,
      x: mouseX - worldBeforeZoom.x * newScale,
      y: mouseY - worldBeforeZoom.y * newScale,
    });

    latestEvent.current = null;
  }, [view, setView]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    // e.preventDefault();
    latestEvent.current = e;
    scheduleUpdate(processZoom);
  }, [scheduleUpdate, processZoom]);

  return onWheel;
}


// export function useZoom() {
//   const view = useCanvasStore((s) => s.view);
//   const setView = useCanvasStore((s) => s.setView);
//   const latestEvent = useRef<WheelEvent | null>(null);
//   const { scheduleUpdate } = useSharedRAF();

//   const processZoom = useCallback(() => {
//     if (!latestEvent.current) return;

//     const e = latestEvent.current;
//     const delta = -e.deltaY * initialConfig.zoomSpeed;
//     const newScale = clamp(view.scale * (1 + delta), initialConfig.minZoom, initialConfig.maxZoom);

//     const target = e.target as HTMLElement;
//     const rect = target.getBoundingClientRect();
//     const mouseX = e.clientX - rect.left;
//     const mouseY = e.clientY - rect.top;

//     const worldBeforeZoom = screenToWorld(mouseX, mouseY, view);

//     setView({
//       scale: newScale,
//       x: mouseX - worldBeforeZoom.x * newScale,
//       y: mouseY - worldBeforeZoom.y * newScale,
//     });

//     latestEvent.current = null;
//   }, [view, setView]);

//   useEffect(() => {
//     const handleWheel = (e: WheelEvent) => {
//       e.preventDefault();
//       latestEvent.current = e;
//       scheduleUpdate(processZoom);
//     };

//     window.addEventListener("wheel", handleWheel, { passive: false });
//     return () => window.removeEventListener("wheel", handleWheel);
//   }, [scheduleUpdate, processZoom]);
// }

// ----