import { useCallback, useEffect } from "react";
import { screenToWorld } from "../utils";
import { useCanvasStore, useShapesStore } from "../stores";
import { useSelectionHandles } from "./use-canvas-selection-handles";

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
    }

    // If not a handle click, proceed with normal selection logic
    const pointerRect = {
      x: worldCoords.x - 1,
      y: worldCoords.y - 1,
      width: 2,
      height: 2,
    };
    
    const candidates = quadtree.query(pointerRect);
    const clickedShape = candidates.length > 0 ? candidates[candidates.length - 1] : null;
    
    // If we clicked on a shape, select it. If we clicked empty space, deselect
    setSelectedShape(clickedShape);
    
    // Prevent the event from bubbling to pan handler if we selected a shape
    if (clickedShape) {
      e.stopPropagation();
    }
  }, [quadtree, view, selectedShape, setSelectedShape, getHandleAtPoint]);

  return { 
    onMouseDown, 
    clearSelection,
    selectedShape 
  };
};