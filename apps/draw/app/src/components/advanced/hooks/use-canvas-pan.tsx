import { useRef, useCallback } from 'react';
import { useCanvasStore } from '../stores';
import { useSharedRAF } from './use-canvas-raf';

export const usePan = () => {
  const setView = useCanvasStore((s) => s.setView);
  const view = useCanvasStore((s) => s.view);

  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const viewStart = useRef({ x: 0, y: 0 });
  const latestMouse = useRef<{ x: number; y: number } | null>(null);

  const { scheduleUpdate } = useSharedRAF();

  const processPan = useCallback(() => {
    if (!isPanning.current || !latestMouse.current) return;
    const dx = latestMouse.current.x - panStart.current.x;
    const dy = latestMouse.current.y - panStart.current.y;
    setView({
      x: viewStart.current.x + dx,
      y: viewStart.current.y + dy,
      scale: view.scale,
    });
  }, [setView, view.scale]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 1) return; // middle mouse
      isPanning.current = true;
      panStart.current = { x: e.clientX, y: e.clientY };
      viewStart.current = { x: view.x, y: view.y };
    },
    [view]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning.current) return;
      latestMouse.current = { x: e.clientX, y: e.clientY };
      scheduleUpdate(processPan);
    },
    [scheduleUpdate, processPan]
  );

  const onMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    isPanning: () => isPanning.current,
  };
};
