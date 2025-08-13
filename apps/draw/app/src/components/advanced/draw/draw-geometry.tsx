import { getViewWorldBounds, Quadtree } from '../utils';
import { initialConfig } from '../config';
import { DrawFunction } from '../models';

export const drawGeometry = (quadtree: Quadtree | null): DrawFunction => {
  return (canvas, canvasKit, view) => {
    if (!quadtree) return;

    const bounds = getViewWorldBounds(view, initialConfig.width, initialConfig.height);
    const visibleShapes = quadtree.query(bounds);

    visibleShapes.forEach((shape) => {
      const paint = new canvasKit.Paint();
      paint.setColor(canvasKit.parseColorString(shape.color));
      canvas.drawRect(
        canvasKit.XYWHRect(shape.x, shape.y, shape.width, shape.height),
        paint
      );
      paint.delete();
    });
  };
};