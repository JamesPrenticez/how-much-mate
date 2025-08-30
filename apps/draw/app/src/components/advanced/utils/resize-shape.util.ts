import { Shape } from "../models";
import { getShapeBoundingRect } from "./get-shape-bounding-rect.util";

export const resizeShape = (shape: Shape, handle: string, deltaX: number, deltaY: number): Shape => {
  switch (shape.type) {
    case 'rectangle':
      return resizeRectangle(shape, handle, deltaX, deltaY);
    
    case 'line':
      return resizeLine(shape, handle, deltaX, deltaY);
    
    case 'polyline':
      return resizePolyline(shape, handle, deltaX, deltaY);
    
    case 'point':
      return resizePoint(shape, handle, deltaX, deltaY);
    
    default:
      return shape;
  }
};

const resizeRectangle = (rect: Shape & { type: 'rectangle' }, handle: string, deltaX: number, deltaY: number): Shape => {
  const { x, y, width, height } = rect;
  const minSize = 10; // Minimum size for rectangles
  
  switch (handle) {
    case 'nw': // Northwest - resize from top-left
      const newWidth = Math.max(minSize, width - deltaX);
      const newHeight = Math.max(minSize, height - deltaY);
      return {
        ...rect,
        x: x + (width - newWidth),
        y: y + (height - newHeight),
        width: newWidth,
        height: newHeight
      };
    
    case 'ne': // Northeast - resize from top-right
      return {
        ...rect,
        y: y + Math.min(deltaY, height - minSize),
        width: Math.max(minSize, width + deltaX),
        height: Math.max(minSize, height - deltaY)
      };
    
    case 'sw': // Southwest - resize from bottom-left
      return {
        ...rect,
        x: x + Math.min(deltaX, width - minSize),
        width: Math.max(minSize, width - deltaX),
        height: Math.max(minSize, height + deltaY)
      };
    
    case 'se': // Southeast - resize from bottom-right
      return {
        ...rect,
        width: Math.max(minSize, width + deltaX),
        height: Math.max(minSize, height + deltaY)
      };
    
    default:
      return rect;
  }
};

const resizeLine = (line: Shape & { type: 'line' }, handle: string, deltaX: number, deltaY: number): Shape => {
  // For lines, we'll move the endpoints based on which corner handle is being dragged
  const bounds = getShapeBoundingRect(line);
  const strokeWidth = line.strokeWidth || 2;
  
  // Map handles to line endpoints based on current line orientation
  const isVertical = Math.abs(line.x2 - line.x1) < Math.abs(line.y2 - line.y1);
  const isReversed = line.x2 < line.x1 || line.y2 < line.y1;
  
  switch (handle) {
    case 'nw':
      if (isVertical) {
        return isReversed ? 
          { ...line, x2: line.x2 + deltaX, y2: line.y2 + deltaY } :
          { ...line, x1: line.x1 + deltaX, y1: line.y1 + deltaY };
      } else {
        return isReversed ? 
          { ...line, x2: line.x2 + deltaX, y2: line.y2 + deltaY } :
          { ...line, x1: line.x1 + deltaX, y1: line.y1 + deltaY };
      }
    
    case 'ne':
      if (isVertical) {
        return isReversed ? 
          { ...line, x1: line.x1 + deltaX, y2: line.y2 + deltaY } :
          { ...line, x2: line.x2 + deltaX, y1: line.y1 + deltaY };
      } else {
        return isReversed ? 
          { ...line, x1: line.x1 + deltaX, y2: line.y2 + deltaY } :
          { ...line, x2: line.x2 + deltaX, y1: line.y1 + deltaY };
      }
    
    case 'sw':
      if (isVertical) {
        return isReversed ? 
          { ...line, x2: line.x2 + deltaX, y1: line.y1 + deltaY } :
          { ...line, x1: line.x1 + deltaX, y2: line.y2 + deltaY };
      } else {
        return isReversed ? 
          { ...line, x2: line.x2 + deltaX, y1: line.y1 + deltaY } :
          { ...line, x1: line.x1 + deltaX, y2: line.y2 + deltaY };
      }
    
    case 'se':
      if (isVertical) {
        return isReversed ? 
          { ...line, x1: line.x1 + deltaX, y1: line.y1 + deltaY } :
          { ...line, x2: line.x2 + deltaX, y2: line.y2 + deltaY };
      } else {
        return isReversed ? 
          { ...line, x1: line.x1 + deltaX, y1: line.y1 + deltaY } :
          { ...line, x2: line.x2 + deltaX, y2: line.y2 + deltaY };
      }
    
    default:
      return line;
  }
};

const resizePolyline = (polyline: Shape & { type: 'polyline' }, handle: string, deltaX: number, deltaY: number): Shape => {
  if (polyline.points.length === 0) return polyline;
  
  const bounds = getShapeBoundingRect(polyline);
  const scaleX = Math.max(0.1, (bounds.width + (handle.includes('e') ? deltaX : -deltaX)) / bounds.width);
  const scaleY = Math.max(0.1, (bounds.height + (handle.includes('s') ? deltaY : -deltaY)) / bounds.height);
  
  // Calculate transform origin based on handle
  let originX = bounds.x;
  let originY = bounds.y;
  
  if (handle.includes('e')) originX = bounds.x; // Scale from left
  if (handle.includes('w')) originX = bounds.x + bounds.width; // Scale from right
  if (handle.includes('s')) originY = bounds.y; // Scale from top  
  if (handle.includes('n')) originY = bounds.y + bounds.height; // Scale from bottom
  
  const newPoints = polyline.points.map(point => ({
    x: originX + (point.x - originX) * scaleX,
    y: originY + (point.y - originY) * scaleY
  }));
  
  return {
    ...polyline,
    points: newPoints
  };
};

const resizePoint = (point: Shape & { type: 'point' }, handle: string, deltaX: number, deltaY: number): Shape => {
  // For points, we'll adjust the radius based on the drag distance
  const currentRadius = point.radius || 3;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const newRadius = Math.max(1, Math.min(20, currentRadius + distance * 0.1));
  
  return {
    ...point,
    radius: newRadius
  };
};