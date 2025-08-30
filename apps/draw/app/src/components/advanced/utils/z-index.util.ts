import { Shape } from "../models";
import { isPointInShape } from "./is-point-in-shape.util";

export const sortShapesByZIndex = (shapes: Shape[]): Shape[] => {
  return [...shapes].sort((a, b) => a.zIndex - b.zIndex);
};

export const getTopmostShapeAtPoint = (
  candidates: Shape[], 
  worldX: number, 
  worldY: number,
): Shape | null => {
  // Filter to only shapes that actually contain the point
  const hitShapes = candidates.filter(shape => 
    isPointInShape(worldX, worldY, shape)
  );
  
  if (hitShapes.length === 0) return null;
  
  // Return the shape with the highest z-index (topmost)
  return hitShapes.reduce((topShape, currentShape) => 
    currentShape.zIndex > topShape.zIndex ? currentShape : topShape
  );
};

// TODO ?Hmm do we really wannt to do this?
// export const getNextZIndex = (shapes: Shape[]): number => {
//   if (shapes.length === 0) return 1;
//   return Math.max(...shapes.map(s => s.zIndex)) + 1;
// };

export const bringShapeToFront = (shape: Shape, allShapes: Shape[]): Shape => {
  const maxZIndex = Math.max(...allShapes.map(s => s.zIndex));
  return {
    ...shape,
    zIndex: maxZIndex + 1
  };
};

export const sendShapeToBack = (shape: Shape, allShapes: Shape[]): Shape => {
  const minZIndex = Math.min(...allShapes.map(s => s.zIndex));
  return {
    ...shape,
    zIndex: minZIndex - 1
  };
};