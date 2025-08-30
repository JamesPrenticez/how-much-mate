// utils/is-point-in-shape.util.ts
import { Shape } from "../models";
import { isPointOnLine } from "./is-point-on-line.util";
import { isPointOnPolyline } from "./is-point-on-polyline.util";

/**
 * Checks if a point is inside a shape using precise geometric hit testing
 * @param worldX - X coordinate in world space
 * @param worldY - Y coordinate in world space
 * @param shape - The shape to test against
 * @returns true if the point is inside the shape
 */
export const isPointInShape = (worldX: number, worldY: number, shape: Shape): boolean => {
  switch (shape.type) {
    case 'rectangle':
      return (
        worldX >= shape.x &&
        worldX <= shape.x + shape.width &&
        worldY >= shape.y &&
        worldY <= shape.y + shape.height
      );
    
    case 'line':
      return isPointOnLine(worldX, worldY, shape.x1, shape.y1, shape.x2, shape.y2, shape.strokeWidth || 2);
    
    case 'polyline':
      return isPointOnPolyline(worldX, worldY, shape.points, shape.strokeWidth || 2, shape.closed);
    
    case 'point':
      const radius = shape.radius || 3;
      const dx = worldX - shape.x;
      const dy = worldY - shape.y;
      return (dx * dx + dy * dy) <= ((radius + 3) * (radius + 3)); // Add 3px tolerance
    
    default:
      return false;
  }
};