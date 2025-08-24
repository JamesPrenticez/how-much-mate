// use-shape-movement.tsx - Optimized with drag preview and deferred updates

import { useRef, useCallback } from 'react';
import { useShapesStore, useCanvasStore } from '../stores';
import { getShapeBoundingRect, moveShape, screenToWorld } from '../utils';
import { useSharedRAF } from './use-canvas-raf';
import { Shape } from '../models';

export const useShapeMovement = () => {
  const selectedShape = useShapesStore(s => s.selectedShape);
  const setDragState = useShapesStore(s => s.setDragState);
  const commitDraggedShape = useShapesStore(s => s.commitDraggedShape);
  const view = useCanvasStore(s => s.view);
  
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const shapeStartState = useRef<Shape | null>(null);
  const latestMouse = useRef<{ x: number, y: number, rect: DOMRect } | null>(null);
  
  const { scheduleUpdate } = useSharedRAF();

  // Optimized: Only updates preview shape, no quadtree rebuilding
  const processDrag = useCallback(() => {
    if (!isDragging.current || !latestMouse.current || !selectedShape || !shapeStartState.current) return;

    const { x, y, rect } = latestMouse.current;
    const screenCoords = {
      x: x - rect.left - 25,
      y: y - rect.top - 25,
    };
    const worldCoords = screenToWorld(screenCoords.x, screenCoords.y, view);
    
    // Calculate the delta from drag start
    const deltaX = worldCoords.x - dragStart.current.x;
    const deltaY = worldCoords.y - dragStart.current.y;
    
    // Create the updated shape for preview
    const previewShape = moveShape(shapeStartState.current, deltaX, deltaY);
    
    // Update only the drag preview (lightweight operation)
    setDragState(true, previewShape);
    
  }, [selectedShape, view, setDragState]);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Only handle left mouse button
    if (e.button !== 0 || !selectedShape) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const screenCoords = {
      x: e.clientX - rect.left - 25,
      y: e.clientY - rect.top - 25,
    };
    const worldCoords = screenToWorld(screenCoords.x, screenCoords.y, view);
    
    // Check if we're clicking within the selected shape's bounding rectangle
    const boundingRect = getShapeBoundingRect(selectedShape);
    const isClickingSelectedShape = (
      worldCoords.x >= boundingRect.x &&
      worldCoords.x <= boundingRect.x + boundingRect.width &&
      worldCoords.y >= boundingRect.y &&
      worldCoords.y <= boundingRect.y + boundingRect.height
    );
    
    if (isClickingSelectedShape) {
      isDragging.current = true;
      dragStart.current = worldCoords;
      shapeStartState.current = { ...selectedShape };
      
      // Start drag state (excludes shape from background cache)
      setDragState(true, selectedShape);
      
      // Prevent event bubbling
      e.stopPropagation();
      e.preventDefault();
    }
  }, [selectedShape, view, setDragState]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    latestMouse.current = { 
      x: e.clientX, 
      y: e.clientY, 
      rect 
    };
    
    // Schedule lightweight preview update
    scheduleUpdate(processDrag);
  }, [scheduleUpdate, processDrag]);

  const onMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    
    // Get the final drag preview shape
    const dragPreviewShape = useShapesStore.getState().dragPreviewShape;
    
    if (dragPreviewShape && selectedShape) {
      // Commit the final shape position (this rebuilds quadtree once)
      commitDraggedShape(dragPreviewShape);
    } else {
      // If no preview, just clear drag state
      setDragState(false, null);
    }
    
    // Reset drag state
    isDragging.current = false;
    latestMouse.current = null;
    shapeStartState.current = null;
    
  }, [selectedShape, commitDraggedShape, setDragState]);

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    isDragging: () => isDragging.current
  };
};