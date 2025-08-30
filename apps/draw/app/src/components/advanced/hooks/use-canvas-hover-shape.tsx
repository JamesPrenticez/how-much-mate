import { useRef, useCallback } from 'react';
import { useShapesStore, useCanvasStore } from '../stores';
import { screenToWorld, isPointInShape } from '../utils';
import { useSelectionHandles } from './use-canvas-selection-handles';
import { Shape } from '../models';

export const useHover = () => {
  const setHoveredShape = useShapesStore(s => s.setHoveredShape);
  const setHoveredHandle = useShapesStore(s => s.setHoveredHandle);
  const quadtree = useShapesStore(s => s.quadtree);
  const view = useCanvasStore(s => s.view);
  const { getHandleAtPoint } = useSelectionHandles();
  
  // Get resize state to handle hover during resize
  const isResizing = useShapesStore(s => s.isResizing);
  const resizePreviewShape = useShapesStore(s => s.resizePreviewShape);
  const isDragging = useShapesStore(s => s.isDragging);
  const dragPreviewShape = useShapesStore(s => s.dragPreviewShape);

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
    
    // CRITICAL FIX: Don't do shape hover detection during drag/resize operations
    // The preview shapes aren't in the quadtree, so hover detection will be inconsistent
    if (isDragging || isResizing) {
      setHoveredShape(null);
      return;
    }
    
    // Otherwise, check for shape hover using quadtree + precise hit testing
    const pointerRect = {
      x: worldCoords.x - 1,
      y: worldCoords.y - 1,
      width: 2,
      height: 2,
    };
    const candidates = quadtree.query(pointerRect);
    
    // FIXED: Use precise hit detection instead of just taking the last candidate
    let hoveredShape: Shape | null = null;
    for (let i = candidates.length - 1; i >= 0; i--) {
      if (isPointInShape(worldCoords.x, worldCoords.y, candidates[i])) {
        hoveredShape = candidates[i];
        break;
      }
    }
    
    setHoveredShape(hoveredShape);
  }, [quadtree, view, setHoveredShape, setHoveredHandle, getHandleAtPoint, 
      isDragging, isResizing, dragPreviewShape, resizePreviewShape, isPointInShape]);

  return { onMouseMove };
};