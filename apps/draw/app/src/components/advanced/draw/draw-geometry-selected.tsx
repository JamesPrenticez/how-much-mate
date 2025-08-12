import { DrawFunction, Shape } from "../models";

export const drawGeometry: DrawFunction<Shape[]> = (canvas, canvasKit, shapes) => {
  shapes.forEach((shape) => {
    if (shape.selected) {
      // Draw selection highlight
      const highlightPaint = new canvasKit.Paint();
      highlightPaint.setColor(canvasKit.Color(0, 123, 255, 0.2 * 255));
      canvas.drawRect(
        canvasKit.XYWHRect(shape.x - 5, shape.y - 5, shape.width + 10, shape.height + 10),
        highlightPaint
      );
      highlightPaint.delete();
    }
    
    const paint = new canvasKit.Paint();
    paint.setColor(canvasKit.parseColorString(shape.color));
    canvas.drawRect(
      canvasKit.XYWHRect(shape.x, shape.y, shape.width, shape.height),
      paint
    );
    paint.delete();
  });
};