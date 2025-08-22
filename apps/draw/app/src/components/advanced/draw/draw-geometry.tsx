import { getViewWorldBounds, Quadtree } from '../utils';
import { initialConfig } from '../config';
import { DrawFunction, Shape } from '../models';
import type { Canvas, CanvasKit } from "canvaskit-wasm";

export const drawGeometry = (quadtree: Quadtree | null): DrawFunction => {
  return (canvas, canvasKit, view) => {
    if (!quadtree) return;

    const bounds = getViewWorldBounds(view, initialConfig.width, initialConfig.height);
    const visibleShapes = quadtree.query(bounds);

    visibleShapes.forEach((shape) => {
      drawShape(canvas, canvasKit, shape);
    });
  };
};

// Shape Types
const drawShape = (canvas: Canvas, canvasKit: CanvasKit, shape: Shape) => {
  const paint = new canvasKit.Paint();
  paint.setColor(canvasKit.parseColorString(shape.color));

  switch (shape.type) {
    case 'rectangle':
      canvas.drawRect(
        canvasKit.XYWHRect(shape.x, shape.y, shape.width, shape.height),
        paint
      );
      break;

    case 'line':
      paint.setStyle(canvasKit.PaintStyle.Stroke);
      paint.setStrokeWidth(shape.strokeWidth || 2);
      
      const linePath = new canvasKit.Path();
      linePath.moveTo(shape.x1, shape.y1);
      linePath.lineTo(shape.x2, shape.y2);
      canvas.drawPath(linePath, paint);
      linePath.delete();
      break;

    case 'polyline':
      if (shape.points.length < 2) break;
      
      paint.setStyle(canvasKit.PaintStyle.Stroke);
      paint.setStrokeWidth(shape.strokeWidth || 2);
      
      const polyPath = new canvasKit.Path();
      const firstPoint = shape.points[0];
      polyPath.moveTo(firstPoint.x, firstPoint.y);
      
      for (let i = 1; i < shape.points.length; i++) {
        polyPath.lineTo(shape.points[i].x, shape.points[i].y);
      }
      
      // Close the path if specified
      if (shape.closed) {
        polyPath.close();
      }
      
      canvas.drawPath(polyPath, paint);
      polyPath.delete();
      break;

    case 'point':
      const radius = shape.radius || 3;
      canvas.drawCircle(shape.x, shape.y, radius, paint);
      break;

    default:
      console.warn(`Unknown shape type: ${(shape as Shape).type}`);
  }

  paint.delete();
};