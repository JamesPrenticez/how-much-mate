import { Shape } from "../models";

export const moveShape = (shape: Shape, deltaX: number, deltaY: number): Shape => {
  switch (shape.type) {
    case 'rectangle':
      return {
        ...shape,
        x: shape.x + deltaX,
        y: shape.y + deltaY
      };

    case 'line':
      return {
        ...shape,
        x1: shape.x1 + deltaX,
        y1: shape.y1 + deltaY,
        x2: shape.x2 + deltaX,
        y2: shape.y2 + deltaY
      };

    case 'polyline':
      return {
        ...shape,
        points: shape.points.map(point => ({
          x: point.x + deltaX,
          y: point.y + deltaY
        }))
      };

    case 'point':
      return {
        ...shape,
        x: shape.x + deltaX,
        y: shape.y + deltaY
      };

    default:
      return shape;
  }
};