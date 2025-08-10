import { Canvas, CanvasKitInstance, Shape, View } from "../types";

export const drawInteraction = (
  canvas: Canvas, 
  view: View, 
  dpr: number, 
  CanvasKit: CanvasKitInstance, 
  hoveredShape: Shape | null, 
  dragPreview: Shape | null
): void => {
  // Draw hover effect
  if (hoveredShape) {
    const paint = new CanvasKit.Paint();
    paint.setColor(CanvasKit.Color(0, 123, 255, 0.8 * 255));
    paint.setStyle(CanvasKit.PaintStyle.Stroke);
    paint.setStrokeWidth(2 / view.scale);
    canvas.drawRect(
      CanvasKit.XYWHRect(hoveredShape.x, hoveredShape.y, hoveredShape.width, hoveredShape.height),
      paint
    );
    paint.delete();
  }
  
  // Draw drag preview
  if (dragPreview) {
    const paint = new CanvasKit.Paint();
    paint.setColor(CanvasKit.Color(255, 0, 0, 0.5 * 255));
    canvas.drawRect(
      CanvasKit.XYWHRect(dragPreview.x, dragPreview.y, dragPreview.width, dragPreview.height),
      paint
    );
    paint.delete();
  }
};
