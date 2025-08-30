import { useCallback } from "react";
import { useHover } from "./use-canvas-hover-shape";
import { usePan } from "./use-canvas-pan";
import { useZoom } from "./use-canvas-zoom";
import { useShapeMovement } from "./use-shape-movement";
import { useShapeResize } from "./use-shape-resize";

export const useInteractions = () => {
  const pan = usePan();
  const movement = useShapeMovement();
  const hover = useHover();
  const zoom = useZoom();
  const resize = useShapeResize();

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      resize.onMouseDown(e);
      if (!resize.isResizing()) {
        movement.onMouseDown(e);
      }
    }

    if (!movement.isDragging() && !resize.isResizing() && e.button === 1) {
      pan.onMouseDown(e);
    }
  }, [movement, pan, resize]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (resize.isResizing()) {
      resize.onMouseMove(e);
    } else if (movement.isDragging()) {
      movement.onMouseMove(e);
    } else if (pan.isPanning()) {
      pan.onMouseMove(e);
    } else {
      hover.onMouseMove(e);
    }
  }, [movement, pan, hover, resize]);

  const handleMouseUp = useCallback(() => {
    resize.onMouseUp();
    movement.onMouseUp();
    pan.onMouseUp();
  }, [movement, pan, resize]);

  return {
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onWheel: zoom,
  };
};