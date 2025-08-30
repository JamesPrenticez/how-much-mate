import { DrawFunction, Shape } from '../models';
import { useCanvasStore } from '../stores/canvas.store';

export const drawHoveredOutline = (hoveredShape: Shape | null): DrawFunction => {
  return (canvas, canvasKit) => {
    if (!hoveredShape) return;

    const view = useCanvasStore.getState().view;

    // Create a stroke paint
    const paint = new canvasKit.Paint();
    paint.setStyle(canvasKit.PaintStyle.Stroke);
    paint.setStrokeWidth(2 / view.scale);
    paint.setColor(canvasKit.parseColorString('#3caffc'));

    // Antialiasing
    paint.setAntiAlias(true);

    switch (hoveredShape.type) {
      case 'rectangle':
        canvas.drawRect(
          canvasKit.XYWHRect(
            hoveredShape.x,
            hoveredShape.y,
            hoveredShape.width,
            hoveredShape.height
          ),
          paint
        );
        break;

      case 'line':
        const linePath = new canvasKit.Path();
        linePath.moveTo(hoveredShape.x1, hoveredShape.y1);
        linePath.lineTo(hoveredShape.x2, hoveredShape.y2);
        canvas.drawPath(linePath, paint);
        linePath.delete();
        break;

      case 'polyline':
        if (hoveredShape.points.length >= 2) {
          const polyPath = new canvasKit.Path();
          const firstPoint = hoveredShape.points[0];
          polyPath.moveTo(firstPoint.x, firstPoint.y);
          
          for (let i = 1; i < hoveredShape.points.length; i++) {
            polyPath.lineTo(hoveredShape.points[i].x, hoveredShape.points[i].y);
          }
          
          if (hoveredShape.closed) {
            polyPath.close();
          }
          
          canvas.drawPath(polyPath, paint);
          polyPath.delete();
        }
        break;

      case 'point':
        const radius = (hoveredShape.radius || 3) + 2; // Slightly larger for hover effect
        canvas.drawCircle(hoveredShape.x, hoveredShape.y, radius, paint);
        break;
    }

    paint.delete();
  };
};
