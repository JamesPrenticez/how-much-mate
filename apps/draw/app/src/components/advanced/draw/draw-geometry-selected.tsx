import { DrawFunction, Shape } from "../models";
import { useCanvasStore } from "../stores";

export const drawSelectedOutline = (selectedShape: Shape | null, hoveredHandle: string | null): DrawFunction => {
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
    const baseHandleSize = 8 / view.scale;
    const hoveredHandleSize = 12 / view.scale; // Larger when hovered
    
    const handlePaint = new canvasKit.Paint();
    handlePaint.setStyle(canvasKit.PaintStyle.Fill);
    handlePaint.setColor(canvasKit.parseColorString('#ff6b35'));
    
    // Corner handles with their types
    const handles = [
      { type: 'nw', x: selectedShape.x, y: selectedShape.y },
      { type: 'ne', x: selectedShape.x + selectedShape.width, y: selectedShape.y },
      { type: 'sw', x: selectedShape.x, y: selectedShape.y + selectedShape.height },
      { type: 'se', x: selectedShape.x + selectedShape.width, y: selectedShape.y + selectedShape.height },
    ];
    
    handles.forEach(handle => {
      const isHovered = hoveredHandle === handle.type;
      const handleSize = isHovered ? hoveredHandleSize : baseHandleSize;
      
      canvas.drawRect(
        canvasKit.XYWHRect(
          handle.x - handleSize/2, 
          handle.y - handleSize/2, 
          handleSize, 
          handleSize
        ),
        handlePaint
      );
    });
    
    paint.delete();
    handlePaint.delete();
  };
};