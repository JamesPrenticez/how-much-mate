import { useCallback, useEffect } from "react";
import { getShapeBoundingRect, isPointOnLine, isPointOnPolyline, screenToWorld } from "../utils";
import { useCanvasStore, useShapesStore } from "../stores";
import { useSelectionHandles } from "./use-canvas-selection-handles";
import { Shape } from "../models";

export const useSelection = () => {
  const setSelectedShape = useShapesStore(s => s.setSelectedShape);
  const selectedShape = useShapesStore(s => s.selectedShape);
  const quadtree = useShapesStore(s => s.quadtree);
  const view = useCanvasStore(s => s.view);
  const { getHandleAtPoint } = useSelectionHandles();

  const clearSelection = useCallback(() => {
    setSelectedShape(null);
  }, [setSelectedShape]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearSelection();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearSelection]);

  // Helper function to check if a point is inside a shape
  const isPointInShape = useCallback((worldX: number, worldY: number, shape: Shape): boolean => {
    switch (shape.type) {
      case 'rectangle':
        return (
          worldX >= shape.x &&
          worldX <= shape.x + shape.width &&
          worldY >= shape.y &&
          worldY <= shape.y + shape.height
        );
      
      case 'line':
        return isPointOnLine(worldX, worldY, shape.x1, shape.y1, shape.x2, shape.y2, shape.strokeWidth || 2);
      
      case 'polyline':
        return isPointOnPolyline(worldX, worldY, shape.points, shape.strokeWidth || 2, shape.closed);
      
      case 'point':
        const radius = shape.radius || 3;
        const dx = worldX - shape.x;
        const dy = worldY - shape.y;
        return (dx * dx + dy * dy) <= ((radius + 3) * (radius + 3)); // Add 3px tolerance
      
      default:
        return false;
    }
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!quadtree) return;
    
    // Only handle left mouse button for selection
    if (e.button !== 0) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const screenCoords = {
      x: e.clientX - rect.left - 25,
      y: e.clientY - rect.top - 25,
    };
    const worldCoords = screenToWorld(screenCoords.x, screenCoords.y, view);

    // If we already have a selected shape, first check if we clicked on its handles
    if (selectedShape) {
      const clickedHandle = getHandleAtPoint(worldCoords.x, worldCoords.y);
      if (clickedHandle) {
        // If we clicked a handle, don't change selection and prevent panning
        console.log('Handle clicked:', clickedHandle);
        e.stopPropagation();
        return;
      }

      // Check if we clicked within the selected shape's bounding rectangle
      const selectedBounds = getShapeBoundingRect(selectedShape);
      if (worldCoords.x >= selectedBounds.x && 
          worldCoords.x <= selectedBounds.x + selectedBounds.width &&
          worldCoords.y >= selectedBounds.y && 
          worldCoords.y <= selectedBounds.y + selectedBounds.height) {
        // Clicked within the selected shape's bounding box - keep it selected
        e.stopPropagation();
        return;
      }
    }

    // Create a small query rectangle around the click point
    const tolerance = 5; // pixels
    const pointerRect = {
      x: worldCoords.x - tolerance,
      y: worldCoords.y - tolerance,
      width: tolerance * 2,
      height: tolerance * 2,
    };
    
    const candidates = quadtree.query(pointerRect);
    
    // Filter candidates by precise hit detection and find the topmost one
    let clickedShape: Shape | null = null;
    for (let i = candidates.length - 1; i >= 0; i--) {
      if (isPointInShape(worldCoords.x, worldCoords.y, candidates[i])) {
        clickedShape = candidates[i];
        break;
      }
    }
    
    // If we clicked on a shape, select it. If we clicked empty space, deselect
    setSelectedShape(clickedShape);
    
    // Prevent the event from bubbling to pan handler if we selected a shape
    if (clickedShape) {
      e.stopPropagation();
    }
  }, [quadtree, view, selectedShape, setSelectedShape, getHandleAtPoint, isPointInShape]);

  return { 
    onMouseDown, 
    clearSelection,
    selectedShape 
  };
};
