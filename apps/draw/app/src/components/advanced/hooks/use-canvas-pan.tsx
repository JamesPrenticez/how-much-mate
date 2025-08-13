import { useRef, useCallback } from 'react';
import { useCanvasStore } from '../stores';

export const usePan = () => {
  const setView = useCanvasStore(s => s.setView);
  const view = useCanvasStore(s => s.view);

  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const viewStart = useRef({ x: 0, y: 0 });

  const latestMouse = useRef<{ x: number; y: number } | null>(null);
  const rafPending = useRef(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left click
    isPanning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY };
    viewStart.current = { x: view.x, y: view.y };
  }, [view]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;

    latestMouse.current = { x: e.clientX, y: e.clientY };

    if (!rafPending.current) {
      rafPending.current = true;
      requestAnimationFrame(() => {
        rafPending.current = false;

        if (!isPanning.current || !latestMouse.current) return;

        const dx = latestMouse.current.x - panStart.current.x;
        const dy = latestMouse.current.y - panStart.current.y;

        setView({
          x: viewStart.current.x + dx,
          y: viewStart.current.y + dy,
          scale: view.scale // preserve zoom level
        });
      });
    }
  }, [setView, view.scale]);

  const onMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  return { onMouseDown, onMouseMove, onMouseUp };
};
