import { Shape } from "../models";

export const getShapeBoundingRect = (shape: Shape): { x: number; y: number; width: number; height: number } => {
  switch (shape.type) {
    case 'rectangle':
      return {
        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height
      };

    case 'line':
      const minX = Math.min(shape.x1, shape.x2);
      const maxX = Math.max(shape.x1, shape.x2);
      const minY = Math.min(shape.y1, shape.y2);
      const maxY = Math.max(shape.y1, shape.y2);
      const strokeWidth = shape.strokeWidth || 2;
      
      return {
        x: minX - strokeWidth / 2,
        y: minY - strokeWidth / 2,
        width: Math.max(10, (maxX - minX) + strokeWidth), // Min 10px for easier selection
        height: Math.max(10, (maxY - minY) + strokeWidth)
      };

    case 'polyline':
      if (shape.points.length === 0) return { x: 0, y: 0, width: 10, height: 10 };
      
      const xs = shape.points.map(p => p.x);
      const ys = shape.points.map(p => p.y);
      const polyMinX = Math.min(...xs);
      const polyMaxX = Math.max(...xs);
      const polyMinY = Math.min(...ys);
      const polyMaxY = Math.max(...ys);
      const polyStrokeWidth = shape.strokeWidth || 2;
      
      return {
        x: polyMinX - polyStrokeWidth / 2,
        y: polyMinY - polyStrokeWidth / 2,
        width: Math.max(10, (polyMaxX - polyMinX) + polyStrokeWidth),
        height: Math.max(10, (polyMaxY - polyMinY) + polyStrokeWidth)
      };

    case 'point':
      const radius = shape.radius || 3;
      const padding = Math.max(5, radius); // Ensure minimum selection area
      return {
        x: shape.x - padding,
        y: shape.y - padding,
        width: padding * 2,
        height: padding * 2
      };

    default:
      return { x: 0, y: 0, width: 10, height: 10 };
  }
};