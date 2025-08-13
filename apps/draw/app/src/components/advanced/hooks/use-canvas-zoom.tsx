import { useEffect, useRef } from "react";
import { useCanvasStore } from "../stores";
import { clamp, screenToWorld } from "../utils";
import { initialConfig } from "../config";

export function useZoom() {
  const view = useCanvasStore((s) => s.view);
  const setView = useCanvasStore((s) => s.setView);

  const latestEvent = useRef<WheelEvent | null>(null);
  const rafPending = useRef(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // stop page scroll
      latestEvent.current = e;

      if (!rafPending.current) {
        rafPending.current = true;
        requestAnimationFrame(() => {
          rafPending.current = false;
          if (!latestEvent.current) return;

          const e = latestEvent.current;

          const delta = -e.deltaY * initialConfig.zoomSpeed;
          const newScale = clamp(view.scale * (1 + delta), initialConfig.minZoom, initialConfig.maxZoom);

          // Get cursor position relative to canvas
          const target = e.target as HTMLElement;
          const rect = target.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          // World coordinates under cursor before zoom
          const worldBeforeZoom = screenToWorld(mouseX, mouseY, view);

          // Update view to keep the same point under cursor
          setView({
            scale: newScale,
            x: mouseX - worldBeforeZoom.x * newScale,
            y: mouseY - worldBeforeZoom.y * newScale,
          });

          latestEvent.current = null;
        });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [view, setView, initialConfig]);
}
