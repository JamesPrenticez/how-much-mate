import { Canvas, CanvasKitInstance, Shape, View } from "../types";

export const drawBackground = (canvas: Canvas, view: View, dpr: number, CanvasKit: CanvasKitInstance, shapes: Shape[]): void => {
  shapes.forEach((shape) => {
    if (shape.selected) {
      // Draw selection highlight
      const highlightPaint = new CanvasKit.Paint();
      highlightPaint.setColor(CanvasKit.Color(0, 123, 255, 0.2 * 255));
      canvas.drawRect(
        CanvasKit.XYWHRect(shape.x - 5, shape.y - 5, shape.width + 10, shape.height + 10),
        highlightPaint
      );
      highlightPaint.delete();
    }
    
    const paint = new CanvasKit.Paint();
    paint.setColor(CanvasKit.parseColorString(shape.color));
    canvas.drawRect(
      CanvasKit.XYWHRect(shape.x, shape.y, shape.width, shape.height),
      paint
    );
    paint.delete();
  });
};