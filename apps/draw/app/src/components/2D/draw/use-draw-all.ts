import { useCallback } from 'react';
import { useShapesStore } from './shapes.store';
import { Canvas, CanvasKitInstance, View } from '../types';
import { drawGrid } from './draw-grid-layer';
import { drawBackground } from './draw-background-layer';
import { drawInteraction } from './draw-interation-layer';

export const useDrawAll = () => {
  const shapes = useShapesStore((s) => s.shapes);
  const hoveredShape = useShapesStore((s) => s.hoveredShape);
  const dragPreview = useShapesStore((s) => s.dragPreview);

  return useCallback(
    (canvas: Canvas, view: View, dpr: number, CanvasKit: CanvasKitInstance) => {
      if (!CanvasKit) return;

      drawGrid(canvas, view, dpr, CanvasKit);
      drawBackground(canvas, view, dpr, CanvasKit, shapes);
      drawInteraction(canvas, view, dpr, CanvasKit, hoveredShape, dragPreview);
    },
    [shapes, hoveredShape, dragPreview]
  );
}