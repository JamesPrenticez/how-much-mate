import { useEffect, useRef, useCallback } from 'react'
import styled from '@emotion/styled';
import { initialConfig } from "../config";
import { useCanvasStore, useShapesStore } from '../stores';
import { drawGeometry, drawHoveredOutline, drawSelectedOutline, drawResizePreview } from '../draw';
import type { Surface } from 'canvaskit-wasm';
import { ViewportCuller } from '../utils/viewport-culler.util';
import { sortShapesByZIndex } from '../utils';

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
  
  // Cache management
  const backgroundCacheValid = useRef(false);
  const lastViewHash = useRef<string>('');
  const excludedShapeId = useRef<number | null>(null);
  const surfacesInitialized = useRef(false);

  const canvasKit = useCanvasStore((s) => s.canvasKit);
  const view = useCanvasStore((s) => s.view);
  const quadtree = useShapesStore((s) => s.quadtree);
  const hoveredShape = useShapesStore((s) => s.hoveredShape);
  const selectedShape = useShapesStore((s) => s.selectedShape);
  const hoveredHandle = useShapesStore(s => s.hoveredHandle);
  const isDragging = useShapesStore(s => s.isDragging);
  const dragPreviewShape = useShapesStore(s => s.dragPreviewShape);
  const isResizing = useShapesStore(s => s.isResizing);
  const resizePreviewShape = useShapesStore(s => s.resizePreviewShape);

  const viewportCuller = new ViewportCuller();

  // Create view hash for cache invalidation
  const createViewHash = useCallback((view: any, quadtreeVersion: any) => {
    return `${Math.round(view.x * 100)}_${Math.round(view.y * 100)}_${Math.round(view.scale * 1000)}_${quadtreeVersion}`;
  }, []);

  // Initialize surfaces with proper null checking
  const initializeSurfaces = useCallback(() => {
    if (!canvasKit || !canvasRef.current || surfacesInitialized.current) return;

    try {
      // Dispose existing surfaces first
      if (surfaceRef.current) {
        surfaceRef.current.dispose();
        surfaceRef.current = null;
      }
      if (backgroundSurfaceRef.current) {
        backgroundSurfaceRef.current.dispose();
        backgroundSurfaceRef.current = null;
      }

      // Create new surfaces
      surfaceRef.current = canvasKit.MakeWebGLCanvasSurface(canvasRef.current);
      backgroundSurfaceRef.current = canvasKit.MakeSurface(
        initialConfig.width, 
        initialConfig.height
      );
      
      if (surfaceRef.current && backgroundSurfaceRef.current) {
        surfacesInitialized.current = true;
        backgroundCacheValid.current = false; // Force cache rebuild
        console.log('RAF-optimized surfaces initialized');
      }
    } catch (error) {
      console.error('Failed to initialize canvas surfaces:', error);
      surfacesInitialized.current = false;
    }
  }, [canvasKit]);

  // Invalidate background cache when needed
  const invalidateBackgroundCache = useCallback((reason: string) => {
    backgroundCacheValid.current = false;
    excludedShapeId.current = null;
    console.log(`Cache invalidated: ${reason}`);
  }, []);

  // Render background to cache surface
  const renderBackgroundCache = useCallback(() => {
    // Comprehensive null checking
    if (!canvasKit || !backgroundSurfaceRef.current || !quadtree || !surfacesInitialized.current) {
      return;
    }

    const canvas = backgroundSurfaceRef.current.getCanvas();
    canvas.clear(canvasKit.TRANSPARENT);

    canvas.save();
    canvas.translate(view.x, view.y);
    canvas.scale(view.scale, view.scale);

    // Get visible shapes, excluding the one being dragged or resized
    const visibleShapes = viewportCuller.getVisibleShapes(
      quadtree, 
      view, 
      initialConfig.width, 
      initialConfig.height
    );

    // Filter out the shape being dragged or resized
    const backgroundShapes = excludedShapeId.current 
      ? visibleShapes.filter(shape => shape.id !== excludedShapeId.current)
      : visibleShapes;

    // Sort shapes by z-index before rendering
    const sortedBackgroudShapes = sortShapesByZIndex(backgroundShapes);

    // Render background shapes
    sortedBackgroudShapes.forEach((shape) => {
      drawGeometry(canvas, canvasKit, shape);
    });

    canvas.restore();
    backgroundSurfaceRef.current.flush();
    backgroundCacheValid.current = true;
    
  }, [canvasKit, view, quadtree, viewportCuller]);

  const render = useCallback((timestamp: number) => {
    // Early exit with comprehensive null checking
    if (!canvasKit || !surfaceRef.current || !backgroundSurfaceRef.current || !surfacesInitialized.current) {
      frameRef.current = requestAnimationFrame(render);
      return;
    }

    // TARGET: 144 fps
    const targetFrameTime = 1000 / 144; 
    if (timestamp - lastFrameTime.current < targetFrameTime) {
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
    } else if (isResizing && selectedShape) {
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
      drawGeometry(canvas, canvasKit, dragPreviewShape);
    }

    // Draw resize preview shape if resizing (semi-transparent with dashed outline)
    if (isResizing && resizePreviewShape) {
      drawResizePreview(resizePreviewShape)(canvas, canvasKit, view);
    }

    // Draw hover outline (only if not dragging or resizing)
    if (!isDragging && !isResizing && hoveredShape) {
      drawHoveredOutline(hoveredShape)(canvas, canvasKit, view);
    }

    // Draw selection outline and handles
    const shapeToOutline = isDragging && dragPreviewShape 
      ? dragPreviewShape 
      : isResizing && resizePreviewShape 
        ? resizePreviewShape 
        : selectedShape;
        
    if (shapeToOutline) {
      drawSelectedOutline(shapeToOutline, hoveredHandle)(canvas, canvasKit, view);
    }

    canvas.restore();
    surfaceRef.current.flush();

    // Continue animation loop
    frameRef.current = requestAnimationFrame(render);
  }, [canvasKit, view, quadtree, hoveredShape, selectedShape, hoveredHandle, 
      isDragging, dragPreviewShape, isResizing, resizePreviewShape, renderBackgroundCache]);

  // Initialize surfaces when CanvasKit is available
  useEffect(() => {
    if (canvasKit) {
      initializeSurfaces();
    }
    
    return () => {
      // Only dispose when component actually unmounts
      if (!canvasKit) {
        if (surfaceRef.current) {
          surfaceRef.current.dispose();
          surfaceRef.current = null;
        }
        if (backgroundSurfaceRef.current) {
          backgroundSurfaceRef.current.dispose();
          backgroundSurfaceRef.current = null;
        }
        surfacesInitialized.current = false;
      }
    };
  }, [canvasKit, initializeSurfaces]);

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
  }, [render, canvasKit]);

  // Watch for changes that require cache invalidation
  useEffect(() => {
    const currentHash = createViewHash(view, quadtree?.shapes?.length || 0);
    if (currentHash !== lastViewHash.current) {
      invalidateBackgroundCache(`View changed: ${lastViewHash.current} -> ${currentHash}`);
      lastViewHash.current = currentHash;
    }
  }, [view, quadtree, createViewHash, invalidateBackgroundCache]);

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