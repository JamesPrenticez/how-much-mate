import { getViewWorldBounds } from '../utils';
import { initialConfig } from '../config';
import { DrawFunction } from '../models';

export const drawGeometry = (): DrawFunction => {
  return (canvas, canvasKit, view, quadtree) => {
    if (!quadtree) return;
    console.log()

    const bounds = getViewWorldBounds(view, initialConfig.width, initialConfig.height);
    const visibleShapes = quadtree.query(bounds);

    console.log(visibleShapes)

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