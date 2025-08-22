import { isPointOnLine } from "./is-point-on-line.util";

export const isPointOnPolyline = (px: number, py: number, points: { x: number; y: number }[], strokeWidth: number, closed?: boolean): boolean => {
  if (points.length < 2) return false;
  
  // Check each line segment
  for (let i = 0; i < points.length - 1; i++) {
    if (isPointOnLine(px, py, points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, strokeWidth)) {
      return true;
    }
  }
  
  // Check closing segment if polyline is closed
  if (closed && points.length > 2) {
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    if (isPointOnLine(px, py, lastPoint.x, lastPoint.y, firstPoint.x, firstPoint.y, strokeWidth)) {
      return true;
    }
  }
  
  return false;
};