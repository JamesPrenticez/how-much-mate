import { Rect, Shape, View } from "../models";
import { Quadtree } from "./quadtree.util";

export class ViewportCuller {
  private lastViewportBounds: Rect | null = null;
  private cachedVisibleShapes: Shape[] = [];
  private cacheValid = false;

  // Calculate precise viewport bounds with margin
  getViewportBounds(view: View, canvasWidth: number, canvasHeight: number, margin = 100): Rect {
    // Convert screen space to world space
    const worldLeft = (-view.x) / view.scale - margin;
    const worldTop = (-view.y) / view.scale - margin;
    const worldWidth = canvasWidth / view.scale + (margin * 2);
    const worldHeight = canvasHeight / view.scale + (margin * 2);

    return {
      x: worldLeft,
      y: worldTop,
      width: worldWidth,
      height: worldHeight
    };
  }

  // Check if viewport has changed significantly
  hasViewportChanged(newBounds: Rect, threshold = 50): boolean {
    if (!this.lastViewportBounds) return true;

    const old = this.lastViewportBounds;
    const xDiff = Math.abs(newBounds.x - old.x);
    const yDiff = Math.abs(newBounds.y - old.y);
    const wDiff = Math.abs(newBounds.width - old.width);
    const hDiff = Math.abs(newBounds.height - old.height);

    return xDiff > threshold || yDiff > threshold || wDiff > threshold || hDiff > threshold;
  }

  // Get visible shapes with caching
  getVisibleShapes(
    quadtree: Quadtree, 
    view: View, 
    canvasWidth: number, 
    canvasHeight: number,
    forceRefresh = false
  ): Shape[] {
    const viewportBounds = this.getViewportBounds(view, canvasWidth, canvasHeight);
    
    // Use cache if viewport hasn't changed much
    if (!forceRefresh && this.cacheValid && !this.hasViewportChanged(viewportBounds)) {
      return this.cachedVisibleShapes;
    }

    // Query quadtree with viewport bounds
    this.cachedVisibleShapes = quadtree.query(viewportBounds);
    this.lastViewportBounds = viewportBounds;
    this.cacheValid = true;

    return this.cachedVisibleShapes;
  }

  // Invalidate cache when shapes change
  invalidateCache() {
    this.cacheValid = false;
  }

  // Check if a specific shape is in viewport
  isShapeInViewport(shape: Shape, view: View, canvasWidth: number, canvasHeight: number): boolean {
    const viewportBounds = this.getViewportBounds(view, canvasWidth, canvasHeight, 0);
    const shapeBounds = this.getShapeBounds(shape);
    
    return this.rectsOverlap(viewportBounds, shapeBounds);
  }

  private getShapeBounds(shape: Shape): Rect {
    switch (shape.type) {
      case 'rectangle':
        return { x: shape.x, y: shape.y, width: shape.width, height: shape.height };
      
      case 'line':
        const minX = Math.min(shape.x1, shape.x2);
        const maxX = Math.max(shape.x1, shape.x2);
        const minY = Math.min(shape.y1, shape.y2);
        const maxY = Math.max(shape.y1, shape.y2);
        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
      
      case 'point':
        const radius = shape.radius || 3;
        return { x: shape.x - radius, y: shape.y - radius, width: radius * 2, height: radius * 2 };
      
      case 'polyline':
        if (shape.points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
        const xs = shape.points.map((p: { x: number; y: number } ) => p.x);
        const ys = shape.points.map((p: { x: number; y: number } ) => p.y);
        const polyMinX = Math.min(...xs);
        const polyMaxX = Math.max(...xs);
        const polyMinY = Math.min(...ys);
        const polyMaxY = Math.max(...ys);
        return { 
          x: polyMinX, 
          y: polyMinY, 
          width: polyMaxX - polyMinX, 
          height: polyMaxY - polyMinY 
        };
      
      default:
        return { x: 0, y: 0, width: 0, height: 0 };
    }
  }

  private rectsOverlap(a: Rect, b: Rect): boolean {
    return !(a.x + a.width < b.x || b.x + b.width < a.x || 
             a.y + a.height < b.y || b.y + b.height < a.y);
  }
}