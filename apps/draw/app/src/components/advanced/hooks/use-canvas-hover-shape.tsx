import { useRef, useCallback } from 'react';
import { useShapesStore, useCanvasStore } from '../stores';
import { screenToWorld } from '../utils';
import { useSharedRAF } from './use-canvas-raf';
import { useSelectionHandles } from './use-canvas-selection-handles';

export const useHover = () => {
  const setHoveredShape = useShapesStore(s => s.setHoveredShape);
  const setHoveredHandle = useShapesStore(s => s.setHoveredHandle);
  const quadtree = useShapesStore(s => s.quadtree);
  const view = useCanvasStore(s => s.view);
  const { getHandleAtPoint } = useSelectionHandles();

  const latestEvent = useRef<{x:number, y:number, rect:DOMRect} | null>(null);
  const { scheduleUpdate } = useSharedRAF();

  const processHover = useCallback(() => {
    if (!latestEvent.current || !quadtree) return;

    const { x, y, rect } = latestEvent.current;
    const screenCoords = {
      x: x - rect.left - 25,
      y: y - rect.top - 25,
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

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!quadtree) return;
    const rect = e.currentTarget.getBoundingClientRect();
    latestEvent.current = { x: e.clientX, y: e.clientY, rect };
    scheduleUpdate(processHover);
  }, [quadtree, scheduleUpdate, processHover]);

  return { onMouseMove };
};
