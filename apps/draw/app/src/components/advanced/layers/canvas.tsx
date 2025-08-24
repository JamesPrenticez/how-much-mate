// canvas.tsx - Performance-optimized with background caching

import { useEffect, useRef, useCallback } from 'react'
import styled from '@emotion/styled';
import { initialConfig } from "../config";
import { useCanvasStore, useShapesStore } from '../stores';
import { drawGeometry, drawHoveredOutline, drawSelectedOutline } from '../draw';
import type { Surface } from 'canvaskit-wasm';
import { ViewportCuller } from '../utils/viewport-culler.util';
import { Shape } from '../models';

const StyledCanvas = styled.canvas`
  position: absolute;
  border: 1px solid red;
`

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const surfaceRef = useRef<Surface | null>(null);
  const backgroundSurfaceRef = useRef<Surface | null>(null);
  const lastFrameTime = useRef(0);
  const frameRef = useRef<number>(0);
  
  // Cache invalidation tracking
  const backgroundCacheValid = useRef(false);
  const lastViewHash = useRef<string>('');
  const excludedShapeId = useRef<number | null>(null);

  const canvasKit = useCanvasStore((s) => s.canvasKit);
  const view = useCanvasStore((s) => s.view);
  const quadtree = useShapesStore((s) => s.quadtree);
  const hoveredShape = useShapesStore((s) => s.hoveredShape);
  const selectedShape = useShapesStore((s) => s.selectedShape);
  const hoveredHandle = useShapesStore(s => s.hoveredHandle);
  const isDragging = useShapesStore(s => s.isDragging);
  const dragPreviewShape = useShapesStore(s => s.dragPreviewShape);

  const viewportCuller = new ViewportCuller();

  // Create view hash for cache invalidation
  const createViewHash = useCallback((view: any, quadtreeVersion: any) => {
    return `${view.x}_${view.y}_${view.scale}_${quadtreeVersion}`;
  }, []);

  // Create surfaces
  useEffect(() => {
    if (!canvasKit || !canvasRef.current) return;

    // Main surface
    surfaceRef.current = canvasKit.MakeWebGLCanvasSurface(canvasRef.current);
    
    // Background cache surface (same size as main canvas)
    backgroundSurfaceRef.current = canvasKit.MakeSurface(
      initialConfig.width, 
      initialConfig.height
    );
    
    return () => {
      surfaceRef.current?.dispose();
      backgroundSurfaceRef.current?.dispose();
      surfaceRef.current = null;
      backgroundSurfaceRef.current = null;
    };
  }, [canvasKit]);

  // Invalidate background cache when needed
  const invalidateBackgroundCache = useCallback(() => {
    backgroundCacheValid.current = false;
    excludedShapeId.current = null;
  }, []);

  // Watch for changes that require cache invalidation
  useEffect(() => {
    const currentHash = createViewHash(view, quadtree?.shapes?.length || 0);
    if (currentHash !== lastViewHash.current) {
      invalidateBackgroundCache();
      lastViewHash.current = currentHash;
    }
  }, [view, quadtree, createViewHash, invalidateBackgroundCache]);

  // Render background to cache surface
  const renderBackgroundCache = useCallback(() => {
    if (!canvasKit || !backgroundSurfaceRef.current || !quadtree) return;

    const canvas = backgroundSurfaceRef.current.getCanvas();
    canvas.clear(canvasKit.TRANSPARENT);

    canvas.save();
    canvas.translate(view.x, view.y);
    canvas.scale(view.scale, view.scale);

    // Get visible shapes, excluding the one being dragged
    const visibleShapes = viewportCuller.getVisibleShapes(
      quadtree, 
      view, 
      initialConfig.width, 
      initialConfig.height
    );

    // Filter out the shape being dragged
    const backgroundShapes = excludedShapeId.current 
      ? visibleShapes.filter(shape => shape.id !== excludedShapeId.current)
      : visibleShapes;

    // Render background shapes
    backgroundShapes.forEach((shape) => {
      renderSingleShape(canvas, canvasKit, shape);
    });

    canvas.restore();
    backgroundSurfaceRef.current.flush();
    backgroundCacheValid.current = true;
  }, [canvasKit, view, quadtree, viewportCuller]);

  // Main render function with layer compositing
  const render = useCallback((timestamp: number) => {
    if (!canvasKit || !surfaceRef.current || !backgroundSurfaceRef.current) return;

    // Throttle to 60fps max
    if (timestamp - lastFrameTime.current < 16.67) {
      frameRef.current = requestAnimationFrame(render);
      return;
    }
    lastFrameTime.current = timestamp;

    // Update background cache if needed
    if (isDragging && selectedShape) {
      // When starting drag, exclude the selected shape from background
      if (excludedShapeId.current !== selectedShape.id) {
        excludedShapeId.current = selectedShape.id;
        backgroundCacheValid.current = false;
      }
    } else {
      // When not dragging, include all shapes in background
      if (excludedShapeId.current !== null) {
        excludedShapeId.current = null;
        backgroundCacheValid.current = false;
      }
    }

    if (!backgroundCacheValid.current) {
      renderBackgroundCache();
    }

    // Composite final frame
    const canvas = surfaceRef.current.getCanvas();
    canvas.clear(canvasKit.TRANSPARENT);

    // Layer 1: Draw cached background
    const backgroundImage = backgroundSurfaceRef.current.makeImageSnapshot();
    canvas.drawImage(backgroundImage, 0, 0);
    backgroundImage.delete();

    // Layer 2: Draw foreground elements (shapes being dragged, hover, selection)
    canvas.save();
    canvas.translate(view.x, view.y);
    canvas.scale(view.scale, view.scale);

    // Draw drag preview shape if dragging
    if (isDragging && dragPreviewShape) {
      renderSingleShape(canvas, canvasKit, dragPreviewShape);
    }

    // Draw hover outline (only if not dragging)
    if (!isDragging && hoveredShape) {
      drawHoveredOutline(hoveredShape)(canvas, canvasKit, view);
    }

    // Draw selection outline and handles
    const shapeToOutline = isDragging && dragPreviewShape ? dragPreviewShape : selectedShape;
    if (shapeToOutline) {
      drawSelectedOutline(shapeToOutline, hoveredHandle)(canvas, canvasKit, view);
    }

    canvas.restore();
    surfaceRef.current.flush();

    // Continue animation loop
    frameRef.current = requestAnimationFrame(render);
  }, [canvasKit, view, quadtree, hoveredShape, selectedShape, hoveredHandle, 
      isDragging, dragPreviewShape, renderBackgroundCache]);

  // Start render loop
  useEffect(() => {
    if (canvasKit && surfaceRef.current && backgroundSurfaceRef.current) {
      frameRef.current = requestAnimationFrame(render);
    }
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [render]);

  // Invalidate cache when shapes change
  useEffect(() => {
    invalidateBackgroundCache();
  }, [quadtree, invalidateBackgroundCache]);

  return (
    <StyledCanvas
      ref={canvasRef}
      onContextMenu={(e) => e.preventDefault()}
      width={initialConfig.width}
      height={initialConfig.height}
      style={{ borderColor: 'cyan' }}
    />
  );
};

// Optimized single shape rendering function
function renderSingleShape(canvas: any, canvasKit: any, shape: Shape) {
  const paint = new canvasKit.Paint();
  paint.setColor(canvasKit.parseColorString(shape.color));

  switch (shape.type) {
    case 'rectangle':
      canvas.drawRect(
        canvasKit.XYWHRect(shape.x, shape.y, shape.width, shape.height),
        paint
      );
      break;

    case 'line':
      paint.setStyle(canvasKit.PaintStyle.Stroke);
      paint.setStrokeWidth(shape.strokeWidth || 2);
      
      const linePath = new canvasKit.Path();
      linePath.moveTo(shape.x1, shape.y1);
      linePath.lineTo(shape.x2, shape.y2);
      canvas.drawPath(linePath, paint);
      linePath.delete();
      break;

    case 'polyline':
      if (shape.points.length < 2) break;
      
      paint.setStyle(canvasKit.PaintStyle.Stroke);
      paint.setStrokeWidth(shape.strokeWidth || 2);
      
      const polyPath = new canvasKit.Path();
      const firstPoint = shape.points[0];
      polyPath.moveTo(firstPoint.x, firstPoint.y);
      
      for (let i = 1; i < shape.points.length; i++) {
        polyPath.lineTo(shape.points[i].x, shape.points[i].y);
      }
      
      if (shape.closed) {
        polyPath.close();
      }
      
      canvas.drawPath(polyPath, paint);
      polyPath.delete();
      break;

    case 'point':
      const radius = shape.radius || 3;
      canvas.drawCircle(shape.x, shape.y, radius, paint);
      break;
  }

  paint.delete();
}