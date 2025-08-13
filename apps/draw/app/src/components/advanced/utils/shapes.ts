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
    
    // case 'circle':
    //   const dx = x - shape.x;
    //   const dy = y - shape.y;
    //   return (dx * dx + dy * dy) <= (shape.radius * shape.radius);
    
    // case 'polygon':
    //   return isPointInPolygon(x, y, shape.points);
    
    default:
      return false;
  }
};

// const isPointInPolygon = (x: number, y: number, points: { x: number; y: number }[]): boolean => {
//   let inside = false;
  
//   for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
//     const xi = points[i].x;
//     const yi = points[i].y;
//     const xj = points[j].x;
//     const yj = points[j].y;
    
//     if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
//       inside = !inside;
//     }
//   }
  
//   return inside;
// };