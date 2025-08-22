import { Shape } from "../models";

export const getShapeAt = (worldX: number, worldY: number, shapes: any[]) => {
  // Iterate through shapes in reverse order (top to bottom)
  for (let i = shapes.length - 1; i >= 0; i--) {
    const shape = shapes[i];
    
    if (isPointInShape(worldX, worldY, shape)) {
      return shape;
    }
  }
  
  return null;
};

const isPointInShape = (x: number, y: number, shape: Shape): boolean => {
  switch (shape.type) {
    case 'rectangle':
      return (
        x >= shape.x &&
        x <= shape.x + shape.width &&
        y >= shape.y &&
        y <= shape.y + shape.height
      );
    
    case 'line':
      return isPointOnLine(x, y, shape.x1, shape.y1, shape.x2, shape.y2, shape.strokeWidth || 2);
    
    case 'polyline':
      return isPointOnPolyline(x, y, shape.points, shape.strokeWidth || 2, shape.closed);
    
    case 'point':
      const radius = shape.radius || 3;
      const dx = x - shape.x;
      const dy = y - shape.y;
      return (dx * dx + dy * dy) <= (radius * radius);
    
    default:
      return false;
  }
};

const isPointOnLine = (px: number, py: number, x1: number, y1: number, x2: number, y2: number, strokeWidth: number): boolean => {
  const tolerance = strokeWidth / 2 + 2; // Add small buffer for easier clicking
  
  // Vector from line start to point
  const A = px - x1;
  const B = py - y1;
  
  // Vector from line start to end
  const C = x2 - x1;
  const D = y2 - y1;
  
  // Calculate the dot product and squared length
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  
  // Handle zero-length line
  if (lenSq === 0) {
    const dx = px - x1;
    const dy = py - y1;
    return Math.sqrt(dx * dx + dy * dy) <= tolerance;
  }
  
  // Calculate parameter t (projection of point onto line)
  const t = Math.max(0, Math.min(1, dot / lenSq));
  
  // Find the closest point on the line segment
  const closestX = x1 + t * C;
  const closestY = y1 + t * D;
  
  // Calculate distance from point to closest point on line
  const dx = px - closestX;
  const dy = py - closestY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  return distance <= tolerance;
};

const isPointOnPolyline = (px: number, py: number, points: { x: number; y: number }[], strokeWidth: number, closed?: boolean): boolean => {
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
