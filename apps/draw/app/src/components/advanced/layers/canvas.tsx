import { useEffect, useRef, useCallback } from 'react'
import styled from '@emotion/styled';
import { initialConfig } from "../config";
import { useCanvasStore, useShapesStore } from '../stores';
import { drawGeometry, drawHoveredOutline, drawSelectedOutline } from '../draw';
import type { Surface } from 'canvaskit-wasm';

const StyledCanvas = styled.canvas`
  position: absolute;
  border: 1px solid red;
`

export const Canvas = () => {
  const draggingShape = false; // do we need this?
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const surfaceRef = useRef<Surface | null>(null);
  const lastFrameTime = useRef(0);
  const frameRef = useRef<number>(0);

  const canvasKit = useCanvasStore((s) => s.canvasKit);
  const view = useCanvasStore((s) => s.view);
  const quadtree = useShapesStore((s) => s.quadtree);
  const hoveredShape = useShapesStore((s) => s.hoveredShape);
  const selectedShape = useShapesStore((s) => s.selectedShape);
  const hoveredHandle = useShapesStore(s => s.hoveredHandle);

  // Create surface only once
  useEffect(() => {
    if (!canvasKit || !canvasRef.current) return;

    surfaceRef.current = canvasKit.MakeWebGLCanvasSurface(canvasRef.current);
    
    return () => {
      surfaceRef.current?.dispose();
      surfaceRef.current = null;
    };
  }, [canvasKit]);

  // Optimized render function with layer compositing
  const render = useCallback((timestamp: number) => {
    if (!canvasKit || !surfaceRef.current) return;

    // Throttle to 60fps max
    if (timestamp - lastFrameTime.current < 16.67) {
      frameRef.current = requestAnimationFrame(render);
      return;
    }
    lastFrameTime.current = timestamp;

    const canvas = surfaceRef.current.getCanvas();
    canvas.clear(canvasKit.TRANSPARENT);

    canvas.save();
    canvas.translate(view.x, view.y);
    canvas.scale(view.scale, view.scale);

    // Layer 1: Background geometry
    if (quadtree) {
      // Create a modified quadtree or shapes list for dragging
      const modifiedShapes = draggingShape && selectedShape ? 
        createDraggedShapesList(quadtree, selectedShape, draggingShape) : null;
      
      if (modifiedShapes) {
        // Render with temporarily modified shape
        renderShapesDirectly(canvas, canvasKit, modifiedShapes);
      } else {
        // Normal rendering
        drawGeometry(quadtree)(canvas, canvasKit, view);
      }
    }

    // Layer 2: Hover outline (only if not dragging)
    if (!draggingShape && hoveredShape) {
      drawHoveredOutline(hoveredShape)(canvas, canvasKit, view);
    }

    // Layer 3: Selection outline and handles
    const shapeToOutline = draggingShape || selectedShape;
    if (shapeToOutline) {
      drawSelectedOutline(shapeToOutline, hoveredHandle)(canvas, canvasKit, view);
    }

    canvas.restore();
    surfaceRef.current.flush();

    // Continue animation loop
    frameRef.current = requestAnimationFrame(render);
  }, [canvasKit, view, quadtree, hoveredShape, selectedShape, hoveredHandle, draggingShape]);

  // Start render loop
  useEffect(() => {
    if (canvasKit && surfaceRef.current) {
      frameRef.current = requestAnimationFrame(render);
    }
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [render]);

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

// Helper function to create a modified shapes list for dragging
function createDraggedShapesList(quadtree: any, selectedShape: any, draggingShape: any) {
  // Get visible shapes from quadtree
  const visibleShapes = quadtree.query({
    x: -1000, y: -1000, width: 2000, height: 2000 // Rough visible area
  });

  // Replace the selected shape with dragging shape
  return visibleShapes.map((shape: any) => 
    shape.id === selectedShape.id ? draggingShape : shape
  );
}

function renderShapesDirectly(canvas: any, canvasKit: any, shapes: any[]) {
  shapes.forEach((shape) => {
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
  });
}