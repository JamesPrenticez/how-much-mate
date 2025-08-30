// import { Canvas, CanvasKitInstance, View } from "../types";

// export const drawGrid = (canvas: Canvas, view: View, dpr: number, CanvasKit: CanvasKitInstance): void => {
//   const gridSize = 50;
//   const { x, y, scale } = view;
  
//   // Calculate visible bounds in world coordinates
//   const left = -x / scale;
//   const top = -y / scale;
//   const right = left + (800 / scale);
//   const bottom = top + (600 / scale);
  
//   const paint = new CanvasKit.Paint();
//   paint.setColor(CanvasKit.Color(200, 200, 200, 0.5 * 255));
//   paint.setStyle(CanvasKit.PaintStyle.Stroke);
//   paint.setStrokeWidth(1 / scale);
  
//   const path = new CanvasKit.Path();
  
//   // Vertical lines
//   const startX = Math.floor(left / gridSize) * gridSize;
//   for (let x = startX; x <= right + gridSize; x += gridSize) {
//     path.moveTo(x, top);
//     path.lineTo(x, bottom);
//   }
  
//   // Horizontal lines
//   const startY = Math.floor(top / gridSize) * gridSize;
//   for (let y = startY; y <= bottom + gridSize; y += gridSize) {
//     path.moveTo(left, y);
//     path.lineTo(right, y);
//   }
  
//   canvas.drawPath(path, paint);
  
//   paint.delete();
//   path.delete();
// };
