import { DrawFunction } from "../models";

export const drawSimpleRect2: DrawFunction = (canvas, canvasKit) => {
  const paint = new canvasKit.Paint();
  paint.setColor(canvasKit.Color(0, 255, 255, 1.0)); 
  canvas.drawRect(canvasKit.XYWHRect(500, 100, 150, 100), paint);
  paint.delete();
};