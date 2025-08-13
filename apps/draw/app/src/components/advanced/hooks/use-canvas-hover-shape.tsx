import { useRef, useCallback } from 'react';
import { useShapesStore, useCanvasStore } from '../stores';
import { screenToWorld } from '../utils';

export const useHover = () => {
  const setHoveredShape = useShapesStore(s => s.setHoveredShape);
  const quadtree = useShapesStore(s => s.quadtree);
  const view = useCanvasStore(s => s.view);

  const latestEvent = useRef<{x:number, y:number, rect:DOMRect} | null>(null);
  const rafPending = useRef(false);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!quadtree) return;
    const rect = e.currentTarget.getBoundingClientRect();
    latestEvent.current = { x: e.clientX, y: e.clientY, rect };

    if (!rafPending.current) {
      rafPending.current = true;
      requestAnimationFrame(() => {
        rafPending.current = false;
        if (!latestEvent.current || !quadtree) return;

        const { x, y, rect } = latestEvent.current;
        const screenCoords = {
          x: x - rect.left - 25,
          y: y - rect.top - 25,
        };
        const worldCoords = screenToWorld(screenCoords.x, screenCoords.y, view);
        const pointerRect = {
          x: worldCoords.x - 1,
          y: worldCoords.y - 1,
          width: 2,
          height: 2,
        };
        const candidates = quadtree.query(pointerRect);
        setHoveredShape(
          candidates.length > 0 ? candidates[candidates.length - 1] : null
        );
      });
    }
  }, [quadtree, view, setHoveredShape]);

  return { onMouseMove };
};
