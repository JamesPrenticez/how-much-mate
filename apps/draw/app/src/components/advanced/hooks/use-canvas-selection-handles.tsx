import { useCallback } from "react";
import { useCanvasStore, useShapesStore } from "../stores";

export const useSelectionHandles = () => {
  const selectedShape = useShapesStore(s => s.selectedShape);
  const view = useCanvasStore(s => s.view);
  
  const getHandleAtPoint = useCallback((worldX: number, worldY: number) => {
    if (!selectedShape) return null;
    
    const handleSize = 8 / view.scale;
    const tolerance = handleSize;
    
    const handles = [
      { type: 'nw', x: selectedShape.x, y: selectedShape.y },
      { type: 'ne', x: selectedShape.x + selectedShape.width, y: selectedShape.y },
      { type: 'sw', x: selectedShape.x, y: selectedShape.y + selectedShape.height },
      { type: 'se', x: selectedShape.x + selectedShape.width, y: selectedShape.y + selectedShape.height },
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