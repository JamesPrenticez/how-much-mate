import { useRef, useCallback } from 'react';
import { useCanvasStore } from '../stores';

export const usePan = () => {
  const setView = useCanvasStore(s => s.setView);
  const view = useCanvasStore(s => s.view);
  
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const viewStart = useRef({ x: 0, y: 0 });
  const lastUpdate = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 1) return; // middle mouse only
    
    isPanning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY };
    viewStart.current = { x: view.x, y: view.y };
    
    e.preventDefault();
  }, [view]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    
    // OPTIMIZATION: Direct update, no RAF batching
    // Throttle to 120fps max (8.33ms) instead of 60fps (16ms)
    const now = performance.now();
    if (now - lastUpdate.current < 8) return;
    lastUpdate.current = now;
    
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    
    // IMMEDIATE update - no waiting for next frame
    setView({
      x: viewStart.current.x + dx,
      y: viewStart.current.y + dy,
      scale: view.scale,
    });
  }, [setView, view.scale]);

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
