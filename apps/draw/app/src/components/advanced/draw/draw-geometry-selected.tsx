import { DrawFunction, Shape } from "../models";
import { useCanvasStore } from "../stores";

export const drawSelectedOutline = (selectedShape: Shape | null): DrawFunction => {
  return (canvas, canvasKit) => {
    if (!selectedShape) return;
    const view = useCanvasStore.getState().view;
    
    // Create a stroke paint for selection (different color/style than hover)
    const paint = new canvasKit.Paint();
    paint.setStyle(canvasKit.PaintStyle.Stroke);
    paint.setStrokeWidth(2 / view.scale);
    paint.setColor(canvasKit.parseColorString('#ff6b35')); // Orange for selection
    
    // Draw rectangle outline
    canvas.drawRect(
      canvasKit.XYWHRect(
        selectedShape.x,
        selectedShape.y,
        selectedShape.width,
        selectedShape.height
      ),
      paint
    );
    
    // Draw selection handles (small squares at corners)
    const handleSize = 8 / view.scale;
    const handlePaint = new canvasKit.Paint();
    handlePaint.setStyle(canvasKit.PaintStyle.Fill);
    handlePaint.setColor(canvasKit.parseColorString('#ff6b35'));
    
    // Corner handles
    const corners = [
      { x: selectedShape.x - handleSize/2, y: selectedShape.y - handleSize/2 },
      { x: selectedShape.x + selectedShape.width - handleSize/2, y: selectedShape.y - handleSize/2 },
      { x: selectedShape.x - handleSize/2, y: selectedShape.y + selectedShape.height - handleSize/2 },
      { x: selectedShape.x + selectedShape.width - handleSize/2, y: selectedShape.y + selectedShape.height - handleSize/2 },
    ];
    
    corners.forEach(corner => {
      canvas.drawRect(
        canvasKit.XYWHRect(corner.x, corner.y, handleSize, handleSize),
        handlePaint
      );
    });
    
    paint.delete();
    handlePaint.delete();
  };
};