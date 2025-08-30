// hooks/use-shape-resize.tsx
import { useRef, useCallback } from 'react';
import { useShapesStore, useCanvasStore } from '../stores';
import { screenToWorld, resizeShape } from '../utils';
import { Shape } from '../models';
import { useSelectionHandles } from './use-canvas-selection-handles';

export const useShapeResize = () => {
  const selectedShape = useShapesStore(s => s.selectedShape);
  const setResizeState = useShapesStore(s => s.setResizeState);
  const commitResizedShape = useShapesStore(s => s.commitResizedShape);
  const view = useCanvasStore(s => s.view);
  const { getHandleAtPoint } = useSelectionHandles();
  
  const isResizing = useRef(false);
  const resizeHandle = useRef<string | null>(null);
  const resizeStart = useRef({ x: 0, y: 0 });
  const shapeStart = useRef<Shape | null>(null);
  const lastUpdate = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0 || !selectedShape) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const worldCoords = screenToWorld(
      e.clientX - rect.left - 25,
      e.clientY - rect.top - 25,
      view
    );
    
    // Check if clicking on a resize handle
    const handle = getHandleAtPoint(worldCoords.x, worldCoords.y);
    
    if (handle) {
      isResizing.current = true;
      resizeHandle.current = handle;
      resizeStart.current = worldCoords;
      shapeStart.current = { ...selectedShape };
      
      // Start resize state immediately
      setResizeState(true, selectedShape, handle);
      
      e.stopPropagation();
      e.preventDefault();
    }
  }, [selectedShape, setResizeState, view, getHandleAtPoint]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isResizing.current || !shapeStart.current || !resizeHandle.current) return;
    
    // Target 144fps for smooth resize (6.94ms)
    const now = performance.now();
    if (now - lastUpdate.current < 7) return;
    lastUpdate.current = now;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const worldCoords = screenToWorld(
      e.clientX - rect.left - 25,
      e.clientY - rect.top - 25,
      view
    );
    
    const deltaX = worldCoords.x - resizeStart.current.x;
    const deltaY = worldCoords.y - resizeStart.current.y;
    
    // Calculate new shape dimensions based on handle and delta
    const previewShape = resizeShape(shapeStart.current, resizeHandle.current, deltaX, deltaY);
    setResizeState(true, previewShape, resizeHandle.current);
    
  }, [setResizeState, view]);

  const onMouseUp = useCallback(() => {
    if (!isResizing.current) return;
    
    // Get the final resize preview shape
    const resizePreviewShape = useShapesStore.getState().resizePreviewShape;
    
    if (resizePreviewShape && selectedShape) {
      // Commit the final shape dimensions
      commitResizedShape(resizePreviewShape);
    } else {
      // If no preview, just clear resize state
      setResizeState(false, null, null);
    }
    
    // Reset resize state
    isResizing.current = false;
    resizeHandle.current = null;
    
  }, [selectedShape, commitResizedShape, setResizeState]);

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    isResizing: () => isResizing.current,
    getResizeHandle: () => resizeHandle.current
  };
};