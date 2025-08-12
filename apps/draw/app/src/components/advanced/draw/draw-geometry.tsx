import { DrawFunction, Shape } from "../models";

export const drawGeometry = (shapes: Shape[]): DrawFunction => {
  return (canvas, canvasKit) => {
  shapes.forEach((shape) => {
    const paint = new canvasKit.Paint();
    paint.setColor(canvasKit.parseColorString(shape.color));
    canvas.drawRect(
      canvasKit.XYWHRect(shape.x, shape.y, shape.width, shape.height),
      paint
    );
    paint.delete();
  });
  };
};