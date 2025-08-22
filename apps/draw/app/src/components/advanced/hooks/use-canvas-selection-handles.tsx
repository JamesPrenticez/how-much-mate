import { useCallback } from "react";
import { useCanvasStore, useShapesStore } from "../stores";
import { getShapeBoundingRect } from "../utils";

export const useSelectionHandles = () => {
  const selectedShape = useShapesStore(s => s.selectedShape);
  const view = useCanvasStore(s => s.view);
  
  const getHandleAtPoint = useCallback((worldX: number, worldY: number) => {
    if (!selectedShape) return null;
    
    const handleSize = 8 / view.scale;
    const tolerance = handleSize;
    
    // Get bounding rectangle for the selected shape
    const boundingRect = getShapeBoundingRect(selectedShape);
    
    const handles = [
      { type: 'nw', x: boundingRect.x, y: boundingRect.y },
      { type: 'ne', x: boundingRect.x + boundingRect.width, y: boundingRect.y },
      { type: 'sw', x: boundingRect.x, y: boundingRect.y + boundingRect.height },
      { type: 'se', x: boundingRect.x + boundingRect.width, y: boundingRect.y + boundingRect.height },
    ];
    
    for (const handle of handles) {
      const dx = Math.abs(worldX - handle.x);
      const dy = Math.abs(worldY - handle.y);
      if (dx <= tolerance && dy <= tolerance) {
        return handle.type;
      }
    }
    
    return null;
  }, [selectedShape, view.scale]);
  
  return { getHandleAtPoint };
};