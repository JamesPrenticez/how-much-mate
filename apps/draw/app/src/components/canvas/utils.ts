import { Canvas, CanvasKitInstance, Shape, View } from "./types";

// Layer drawing functions using CanvasKit
export const drawGrid = (canvas: Canvas, view: View, dpr: number, CanvasKit: CanvasKitInstance): void => {
  const gridSize = 50;
  const { x, y, scale } = view;
  
  // Calculate visible bounds in world coordinates
  const left = -x / scale;
  const top = -y / scale;
  const right = left + (800 / scale);
  const bottom = top + (600 / scale);
  
  const paint = new CanvasKit.Paint();
  paint.setColor(CanvasKit.Color(200, 200, 200, 0.5 * 255));
  paint.setStyle(CanvasKit.PaintStyle.Stroke);
  paint.setStrokeWidth(1 / scale);
  
  const path = new CanvasKit.Path();
  
  // Vertical lines
  const startX = Math.floor(left / gridSize) * gridSize;
  for (let x = startX; x <= right + gridSize; x += gridSize) {
    path.moveTo(x, top);
    path.lineTo(x, bottom);
  }
  
  // Horizontal lines
  const startY = Math.floor(top / gridSize) * gridSize;
  for (let y = startY; y <= bottom + gridSize; y += gridSize) {
    path.moveTo(left, y);
    path.lineTo(right, y);
  }
  
  canvas.drawPath(path, paint);
  
  paint.delete();
  path.delete();
};

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

