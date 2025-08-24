// canvas.tsx - Enhanced with persistent cache management

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
  
  // Enhanced cache management
  const backgroundCacheValid = useRef(false);
  const lastViewHash = useRef<string>('');
  const excludedShapeId = useRef<number | null>(null);
  const surfacesInitialized = useRef(false);
  
  // Performance metrics
  const frameCount = useRef(0);
  const lastFpsTime = useRef(0);
  const renderTimes = useRef<number[]>([]);
  const cacheHits = useRef(0);
  const cacheMisses = useRef(0);

  const canvasKit = useCanvasStore((s) => s.canvasKit);
  const view = useCanvasStore((s) => s.view);
  const quadtree = useShapesStore((s) => s.quadtree);
  const hoveredShape = useShapesStore((s) => s.hoveredShape);
  const selectedShape = useShapesStore((s) => s.selectedShape);
  const hoveredHandle = useShapesStore(s => s.hoveredHandle);
  const isDragging = useShapesStore(s => s.isDragging);
  const dragPreviewShape = useShapesStore(s => s.dragPreviewShape);
  const updatePerformanceMetrics = useShapesStore(s => s.updatePerformanceMetrics);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const viewportCuller = new ViewportCuller();

  // Create view hash for cache invalidation
  const createViewHash = useCallback((view: any, quadtreeVersion: any) => {
    return `${Math.round(view.x * 100)}_${Math.round(view.y * 100)}_${Math.round(view.scale * 1000)}_${quadtreeVersion}`;
  }, []);

  // Initialize surfaces with better lifecycle management
  const initializeSurfaces = useCallback(() => {
    if (!canvasKit || !canvasRef.current || surfacesInitialized.current) return;

    try {
      // Dispose existing surfaces first
      surfaceRef.current?.dispose();
      backgroundSurfaceRef.current?.dispose();

      // Create new surfaces
      surfaceRef.current = canvasKit.MakeWebGLCanvasSurface(canvasRef.current);
      backgroundSurfaceRef.current = canvasKit.MakeSurface(
        initialConfig.width, 
        initialConfig.height
      );
      
      if (surfaceRef.current && backgroundSurfaceRef.current) {
        surfacesInitialized.current = true;
        backgroundCacheValid.current = false; // Force cache rebuild
        console.log('Canvas surfaces initialized');
      }
    } catch (error) {
      console.error('Failed to initialize canvas surfaces:', error);
      surfacesInitialized.current = false;
    }
  }, [canvasKit]);

  // Initialize surfaces when CanvasKit is available
  useEffect(() => {
    if (canvasKit) {
      initializeSurfaces();
    }
    
    return () => {
      // Only dispose when component actually unmounts, not on re-renders
      if (!canvasKit) {
        surfaceRef.current?.dispose();
        backgroundSurfaceRef.current?.dispose();
        surfaceRef.current = null;
        backgroundSurfaceRef.current = null;
        surfacesInitialized.current = false;
      }
    };
  }, [canvasKit, initializeSurfaces]);

  // Invalidate background cache when needed
  const invalidateBackgroundCache = useCallback((reason: string) => {
    backgroundCacheValid.current = false;
    excludedShapeId.current = null;
    cacheMisses.current++;
    console.log(`Cache invalidated: ${reason}`);
  }, []);

  // Watch for changes that require cache invalidation
  useEffect(() => {
    const currentHash = createViewHash(view, quadtree?.shapes?.length || 0);
    if (currentHash !== lastViewHash.current) {
      invalidateBackgroundCache(`View changed: ${lastViewHash.current} -> ${currentHash}`);
      lastViewHash.current = currentHash;
    }
  }, [view, quadtree, createViewHash, invalidateBackgroundCache]);

  // Render background to cache surface
  const renderBackgroundCache = useCallback(() => {
    if (!canvasKit || !backgroundSurfaceRef.current || !quadtree || !surfacesInitialized.current) return;

    const startTime = performance.now();
    
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
    
    const renderTime = performance.now() - startTime;
    console.log(`Background cache rebuilt: ${backgroundShapes.length} shapes in ${renderTime.toFixed(2)}ms`);
  }, [canvasKit, view, quadtree, viewportCuller]);

  // Main render function with performance tracking
  const render = useCallback((timestamp: number) => {
    if (!canvasKit || !surfaceRef.current || !backgroundSurfaceRef.current || !surfacesInitialized.current) return;

    const renderStart = performance.now();
    
    // Throttle to 60fps max
    if (timestamp - lastFrameTime.current < 16.67) {
      frameRef.current = requestAnimationFrame(render);
      return;
    }
    lastFrameTime.current = timestamp;

    // Update background cache if needed
    if (isDragging && selectedShape) {
      if (excludedShapeId.current !== selectedShape.id) {
        excludedShapeId.current = selectedShape.id;
        backgroundCacheValid.current = false;
      }
    } else {
      if (excludedShapeId.current !== null) {
        excludedShapeId.current = null;
        backgroundCacheValid.current = false;
      }
    }

    if (!backgroundCacheValid.current) {
      renderBackgroundCache();
      cacheMisses.current++;
    } else {
      cacheHits.current++;
    }

    // Composite final frame
    const canvas = surfaceRef.current.getCanvas();
    canvas.clear(canvasKit.TRANSPARENT);

    // Layer 1: Draw cached background
    const backgroundImage = backgroundSurfaceRef.current.makeImageSnapshot();
    canvas.drawImage(backgroundImage, 0, 0);
    backgroundImage.delete();

    // Layer 2: Draw foreground elements
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

    // Performance tracking
    const renderTime = performance.now() - renderStart;
    renderTimes.current.push(renderTime);
    if (renderTimes.current.length > 60) {
      renderTimes.current.shift(); // Keep only last 60 frames
    }

    frameCount.current++;
    
    // Update FPS every second
    if (timestamp - lastFpsTime.current >= 1000) {
      const fps = frameCount.current;
      const avgRenderTime = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;
      const cacheHitRate = (cacheHits.current / (cacheHits.current + cacheMisses.current)) * 100;
      
      updatePerformanceMetrics({
        fps,
        avgRenderTime,
        cacheHitRate,
        visibleShapes: quadtree ? viewportCuller.getVisibleShapes(quadtree, view, initialConfig.width, initialConfig.height).length : 0,
        totalShapes: quadtree?.shapes?.length || 0,
        isDragging,
        backgroundCacheValid: backgroundCacheValid.current
      });
      
      frameCount.current = 0;
      lastFpsTime.current = timestamp;
    }

    // Continue animation loop
    frameRef.current = requestAnimationFrame(render);
  }, [canvasKit, view, quadtree, hoveredShape, selectedShape, hoveredHandle, 
      isDragging, dragPreviewShape, renderBackgroundCache, viewportCuller, updatePerformanceMetrics]);

  // Start render loop
  useEffect(() => {
    if (canvasKit && surfacesInitialized.current) {
      frameRef.current = requestAnimationFrame(render);
    }
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [render, canvasKit, surfacesInitialized.current]);

  // Invalidate cache when shapes change
  useEffect(() => {
    if (quadtree) {
      invalidateBackgroundCache('Shapes changed');
    }
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