import { useRef, useCallback } from 'react';
import { useShapesStore, useCanvasStore } from '../stores';
import { getShapeBoundingRect, moveShape, screenToWorld } from '../utils';
import { Shape } from '../models';

export const useShapeMovement = () => {
  const selectedShape = useShapesStore(s => s.selectedShape);
  const setDragState = useShapesStore(s => s.setDragState);
  const commitDraggedShape = useShapesStore(s => s.commitDraggedShape);
  const view = useCanvasStore(s => s.view);
  
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
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
    
    // Check if clicking on selected shape
    const boundingRect = getShapeBoundingRect(selectedShape);
    const isInBounds = (
      worldCoords.x >= boundingRect.x &&
      worldCoords.x <= boundingRect.x + boundingRect.width &&
      worldCoords.y >= boundingRect.y &&
      worldCoords.y <= boundingRect.y + boundingRect.height
    );
    
    if (isInBounds) {
      isDragging.current = true;
      dragStart.current = worldCoords;
      shapeStart.current = { ...selectedShape };
      
      // IMMEDIATE drag state - no delay
      setDragState(true, selectedShape);
      
      e.stopPropagation();
      e.preventDefault();
    }
  }, [selectedShape, setDragState, view]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !shapeStart.current) return;
    
    // OPTIMIZATION: Target 144fps for smooth drag (6.94ms)
    const now = performance.now();
    if (now - lastUpdate.current < 7) return;
    lastUpdate.current = now;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const worldCoords = screenToWorld(
      e.clientX - rect.left - 25,
      e.clientY - rect.top - 25,
      view
    );
    
    const deltaX = worldCoords.x - dragStart.current.x;
    const deltaY = worldCoords.y - dragStart.current.y;
    
    // IMMEDIATE preview update - no RAF delay
    const previewShape = moveShape(shapeStart.current, deltaX, deltaY);
    setDragState(true, previewShape);
    
  }, [setDragState, view]);

  const onMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    
    // Get the final drag preview shape
    const dragPreviewShape = useShapesStore.getState().dragPreviewShape;
    
    if (dragPreviewShape && selectedShape) {
      // Commit the final shape position
      commitDraggedShape(dragPreviewShape);
    } else {
      // If no preview, just clear drag state
      setDragState(false, null);
    }
    
    // Reset drag state
    isDragging.current = false;
    
  }, [selectedShape, commitDraggedShape, setDragState]);

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    isDragging: () => isDragging.current
  };
};