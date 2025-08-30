// viewport-culler.util.ts - Enhanced with better caching for drag operations

import { Rect, Shape, View } from "../models";
import { Quadtree } from "./quadtree.util";
import { getShapeBoundingRect } from "./get-shape-bounding-rect.util";

export class ViewportCuller {
  private lastViewportBounds: Rect | null = null;
  private cachedVisibleShapes: Shape[] = [];
  private cacheValid = false;
  private lastViewHash = '';
  private lastQuadtreeTimestamp = 0;

  // Calculate precise viewport bounds with margin
  getViewportBounds(view: View, canvasWidth: number, canvasHeight: number, margin = 100): Rect {
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

  // Create hash for viewport + quadtree state
  private createViewHash(view: View, canvasWidth: number, canvasHeight: number, quadtreeTimestamp: number): string {
    const bounds = this.getViewportBounds(view, canvasWidth, canvasHeight);
    return `${Math.round(bounds.x)}_${Math.round(bounds.y)}_${Math.round(bounds.width)}_${Math.round(bounds.height)}_${quadtreeTimestamp}`;
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

  // Get visible shapes with enhanced caching
  getVisibleShapes(
    quadtree: Quadtree, 
    view: View, 
    canvasWidth: number, 
    canvasHeight: number,
    quadtreeTimestamp: number = Date.now(),
    forceRefresh = false
  ): Shape[] {
    const viewHash = this.createViewHash(view, canvasWidth, canvasHeight, quadtreeTimestamp);
    
    // Use cache if nothing has changed
    if (!forceRefresh && 
        this.cacheValid && 
        viewHash === this.lastViewHash &&
        quadtreeTimestamp === this.lastQuadtreeTimestamp) {
      return this.cachedVisibleShapes;
    }

    // Query quadtree with viewport bounds
    const viewportBounds = this.getViewportBounds(view, canvasWidth, canvasHeight);
    this.cachedVisibleShapes = quadtree.query(viewportBounds);
    
    // Update cache state
    this.lastViewportBounds = viewportBounds;
    this.lastViewHash = viewHash;
    this.lastQuadtreeTimestamp = quadtreeTimestamp;
    this.cacheValid = true;

    return this.cachedVisibleShapes;
  }

  // Optimized: Get visible shapes excluding a specific shape (for drag preview)
  getVisibleShapesExcluding(
    quadtree: Quadtree,
    view: View,
    canvasWidth: number,
    canvasHeight: number,
    excludeShapeId: number,
    quadtreeTimestamp: number = Date.now()
  ): Shape[] {
    const allVisible = this.getVisibleShapes(
      quadtree, 
      view, 
      canvasWidth, 
      canvasHeight, 
      quadtreeTimestamp
    );
    
    return allVisible.filter(shape => shape.id !== excludeShapeId);
  }

  // Invalidate cache when shapes change
  invalidateCache() {
    this.cacheValid = false;
    this.lastViewHash = '';
    this.lastQuadtreeTimestamp = 0;
  }

  // Check if a specific shape is in viewport
  isShapeInViewport(shape: Shape, view: View, canvasWidth: number, canvasHeight: number): boolean {
    const viewportBounds = this.getViewportBounds(view, canvasWidth, canvasHeight, 0);
    const shapeBounds = getShapeBoundingRect(shape);
    
    return this.rectsOverlap(viewportBounds, shapeBounds);
  }

  // Get cache statistics for debugging
  getCacheStats() {
    return {
      cacheValid: this.cacheValid,
      cachedShapeCount: this.cachedVisibleShapes.length,
      lastViewHash: this.lastViewHash,
      lastQuadtreeTimestamp: this.lastQuadtreeTimestamp
    };
  }

  private rectsOverlap(a: Rect, b: Rect): boolean {
    return !(a.x + a.width < b.x || b.x + b.width < a.x || 
             a.y + a.height < b.y || b.y + b.height < a.y);
  }
}