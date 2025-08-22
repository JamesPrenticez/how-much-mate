import { DrawFunction, Shape } from "../models";
import { useCanvasStore } from "../stores";
import { getShapeBoundingRect } from "../utils/get-shape-bounding-rect.util";

export const drawSelectedOutline = (selectedShape: Shape | null, hoveredHandle: string | null): DrawFunction => {
  return (canvas, canvasKit) => {
    if (!selectedShape) return;
    const view = useCanvasStore.getState().view;
    
    // Get bounding rectangle for any shape type
    const boundingRect = getShapeBoundingRect(selectedShape);
    
    // Create a stroke paint for selection (different color/style than hover)
    const paint = new canvasKit.Paint();
    paint.setStyle(canvasKit.PaintStyle.Stroke);
    paint.setStrokeWidth(2 / view.scale);
    paint.setColor(canvasKit.parseColorString('#ff6b35')); // Orange for selection
    
    // Draw bounding rectangle outline
    canvas.drawRect(
      canvasKit.XYWHRect(
        boundingRect.x,
        boundingRect.y,
        boundingRect.width,
        boundingRect.height
      ),
      paint
    );
    
    // Draw selection handles (small squares at corners)
    const baseHandleSize = 8 / view.scale;
    const hoveredHandleSize = 12 / view.scale; // Larger when hovered
    
    const handlePaint = new canvasKit.Paint();
    handlePaint.setStyle(canvasKit.PaintStyle.Fill);
    handlePaint.setColor(canvasKit.parseColorString('#ff6b35'));
    
    // Corner handles with their types based on bounding rect
    const handles = [
      { type: 'nw', x: boundingRect.x, y: boundingRect.y },
      { type: 'ne', x: boundingRect.x + boundingRect.width, y: boundingRect.y },
      { type: 'sw', x: boundingRect.x, y: boundingRect.y + boundingRect.height },
      { type: 'se', x: boundingRect.x + boundingRect.width, y: boundingRect.y + boundingRect.height },
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