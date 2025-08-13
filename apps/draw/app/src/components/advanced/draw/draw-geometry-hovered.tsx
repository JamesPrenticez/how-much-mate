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

    // Draw rectangle outline
    canvas.drawRect(
      canvasKit.XYWHRect(
        hoveredShape.x,
        hoveredShape.y,
        hoveredShape.width,
        hoveredShape.height
      ),
      paint
    );

    paint.delete();
  };
};
