import { useRef, useCallback } from 'react';
import { useShapesStore, useCanvasStore } from '../stores';
import { screenToWorld } from '../utils';
import { useSelectionHandles } from './use-canvas-selection-handles';

export const useHover = () => {
  const setHoveredShape = useShapesStore(s => s.setHoveredShape);
  const setHoveredHandle = useShapesStore(s => s.setHoveredHandle);
  const quadtree = useShapesStore(s => s.quadtree);
  const view = useCanvasStore(s => s.view);
  const { getHandleAtPoint } = useSelectionHandles();

  const lastUpdate = useRef(0);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!quadtree) return;
    
    // OPTIMIZATION: Direct processing, no RAF batching
    // Throttle to 60fps for hover (16ms)
    const now = performance.now();
    if (now - lastUpdate.current < 16) return;
    lastUpdate.current = now;

    const rect = e.currentTarget.getBoundingClientRect();
    const screenCoords = {
      x: e.clientX - rect.left - 25,
      y: e.clientY - rect.top - 25,
    };
    const worldCoords = screenToWorld(screenCoords.x, screenCoords.y, view);
    
    // First check if we're hovering over a selection handle
    const hoveredHandle = getHandleAtPoint(worldCoords.x, worldCoords.y);
    setHoveredHandle(hoveredHandle);
    
    // If we're hovering a handle, don't show shape hover
    if (hoveredHandle) {
      setHoveredShape(null);
      return;
    }
    
    // Otherwise, check for shape hover
    const pointerRect = {
      x: worldCoords.x - 1,
      y: worldCoords.y - 1,
      width: 2,
      height: 2,
    };
    const candidates = quadtree.query(pointerRect);
    setHoveredShape(
      candidates.length > 0 ? candidates[candidates.length - 1] : null
    );
  }, [quadtree, view, setHoveredShape, setHoveredHandle, getHandleAtPoint]);

  return { onMouseMove };
};
