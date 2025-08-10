import { DrawFunction } from "../models";

export const drawSimpleRect: DrawFunction = (canvas, canvasKit) => {
  const paint = new canvasKit.Paint();
  paint.setColor(canvasKit.Color(255, 0, 255, 1.0)); 
  canvas.drawRect(canvasKit.XYWHRect(100, 100, 150, 100), paint);
  paint.delete();
};