import { useCallback } from "react";
import { useHover } from "./use-canvas-hover-shape";
import { usePan } from "./use-canvas-pan";
import { useZoom } from "./use-canvas-zoom";
import { useShapeMovement } from "./use-shape-movement";

export const useInteractions = () => {
  const pan = usePan();
  const movement = useShapeMovement();
  const hover = useHover();
  const zoom = useZoom();

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Priority order: movement > pan
    if (e.button === 0) {
      movement.onMouseDown(e);
    }
    
    if (!movement.isDragging() && e.button === 1) {
      pan.onMouseDown(e);
    }
  }, [movement, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Handle active interactions first
    if (movement.isDragging()) {
      movement.onMouseMove(e);
    } else if (pan.isPanning()) {
      pan.onMouseMove(e);
    } else {
      // Only do hover when not interacting
      hover.onMouseMove(e);
    }
  }, [movement, pan, hover]);

  const handleMouseUp = useCallback(() => {
    movement.onMouseUp();
    pan.onMouseUp();
  }, [movement, pan]);

  return {
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onWheel: zoom,
  };
};