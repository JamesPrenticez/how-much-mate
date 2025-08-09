import React, { useRef, useState, useCallback, useEffect, useImperativeHandle, forwardRef } from 'react';
import type { CanvasKit as CanvasKitType } from 'canvaskit-wasm';
import { loadCanvasKit } from './loader';
import {
  Canvas,
  CanvasKitInstance,
  PannableCanvasKitProps,
  PannableCanvasKitRef,
  Shape,
  Surface,
  View
} from "./types"

const clamp = (v: number, a: number, b: number): number => Math.max(a, Math.min(b, v));

// CanvasKit-powered pannable canvas component
export const PannableCanvasKit = forwardRef<PannableCanvasKitRef, PannableCanvasKitProps>(function PannableCanvasKit(
  {
    width,
    height,
    draw,
    initialScale = 1,
    initialX = 0,
    initialY = 0,
    className = '',
    background = 'transparent',
    enableZoom = true,
    wheelZoomFactor = 0.0015,
    minZoom = 0.1,
    maxZoom = 8,
  },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const surfaceRef = useRef<Surface | null>(null);
  const canvasKitRef = useRef<CanvasKitInstance | null>(null);
  const dprRef = useRef<number>(1);

  const initialClampedScale = clamp(initialScale, minZoom, maxZoom);
  const viewRef = useRef<View>({
    x: initialX,
    y: initialY,
    scale: initialClampedScale,
  });

  const pointerActiveRef = useRef<boolean>(false);
  const lastPointerPos = useRef<{ x: number; y: number } | null>(null);

  const drawFrame = useCallback(() => {
    const CanvasKit = canvasKitRef.current;
    if (!CanvasKit || !surfaceRef.current) return;
    
    const surface = surfaceRef.current;
    const canvas = surface.getCanvas();
    
    // Clear with background
    if (background === 'transparent') {
      canvas.clear(CanvasKit.TRANSPARENT);
    } else {
      const paint = new CanvasKit.Paint();
      paint.setColor(CanvasKit.parseColorString(background));
      canvas.drawPaint(paint);
      paint.delete();
    }

    // Save canvas state
    canvas.save();

    // Apply transform: translate then scale
    const { x, y, scale } = viewRef.current;
    canvas.translate(x, y);
    canvas.scale(scale, scale);

    // Call the draw function
    draw(canvas, viewRef.current, dprRef.current, CanvasKit);

    // Restore canvas state
    canvas.restore();

    // Flush the surface
    surface.flush();
  }, [background, draw]);

  // Initialize CanvasKit and surface
  useEffect(() => {
    let mounted = true;
    
    const init = async () => {
      try {
        // Load CanvasKit WASM
        const CanvasKit = await loadCanvasKit();
        
        if (!mounted) return;
        
        // Store the CanvasKit instance
        canvasKitRef.current = CanvasKit;
        
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = Math.max(1, window.devicePixelRatio || 1);
        dprRef.current = dpr;
        
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const surface = CanvasKit.MakeCanvasSurface(canvas);
        if (!surface) {
          console.error('Failed to create CanvasKit surface');
          return;
        }
        
        surfaceRef.current = surface;
        drawFrame();
      } catch (error) {
        console.error('Failed to initialize CanvasKit:', error);
      }
    };

    init();
    
    return () => {
      mounted = false;
      if (surfaceRef.current) {
        surfaceRef.current.delete();
        surfaceRef.current = null;
      }
    };
  }, [width, height, drawFrame]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const CanvasKit = canvasKitRef.current;
      if (!CanvasKit || !canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      dprRef.current = dpr;
      
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      if (surfaceRef.current) {
        surfaceRef.current.delete();
      }
      
      const surface = CanvasKit.MakeCanvasSurface(canvas);
      if (surface) {
        surfaceRef.current = surface;
        drawFrame();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, height, drawFrame]);

  // Panning logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onPointerDown = (ev: PointerEvent) => {
      pointerActiveRef.current = true;
      try {
        canvas.setPointerCapture(ev.pointerId);
      } catch (error) {
        console.warn('Failed to set pointer capture:', error);
      }
      lastPointerPos.current = { x: ev.clientX, y: ev.clientY };
    };

    const onPointerMove = (ev: PointerEvent) => {
      if (!pointerActiveRef.current || !lastPointerPos.current) return;

      const dx = ev.clientX - lastPointerPos.current.x;
      const dy = ev.clientY - lastPointerPos.current.y;
      lastPointerPos.current = { x: ev.clientX, y: ev.clientY };

      viewRef.current.x += dx;
      viewRef.current.y += dy;

      drawFrame();
    };

    const onPointerUp = (ev: PointerEvent) => {
      pointerActiveRef.current = false;
      try {
        canvas.releasePointerCapture(ev.pointerId);
      } catch (error) {
        console.warn('Failed to release pointer capture:', error);
      }
      lastPointerPos.current = null;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [drawFrame]);

  // Zoom logic
  useEffect(() => {
    if (!enableZoom) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault();

      const { scale, x, y } = viewRef.current;

      const rect = canvas.getBoundingClientRect();
      const mouseX = ev.clientX - rect.left;
      const mouseY = ev.clientY - rect.top;

      const worldMouseX = (mouseX - x) / scale;
      const worldMouseY = (mouseY - y) / scale;

      const zoomAmount = 1 - ev.deltaY * wheelZoomFactor;
      let newScale = scale * zoomAmount;
      newScale = clamp(newScale, minZoom, maxZoom);

      const newX = mouseX - worldMouseX * newScale;
      const newY = mouseY - worldMouseY * newScale;

      viewRef.current.x = newX;
      viewRef.current.y = newY;
      viewRef.current.scale = newScale;

      drawFrame();
    };

    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheel);
  }, [enableZoom, wheelZoomFactor, minZoom, maxZoom, drawFrame]);

  // Imperative API
  useImperativeHandle(ref, () => ({
    panTo: (x: number, y: number) => {
      viewRef.current.x = x;
      viewRef.current.y = y;
      drawFrame();
    },
    zoomTo: (scale: number, center?: { x: number; y: number }) => {
      const clampedScale = clamp(scale, minZoom, maxZoom);
      if (center && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const mx = center.x - rect.left;
        const my = center.y - rect.top;

        const worldX = (mx - viewRef.current.x) / viewRef.current.scale;
        const worldY = (my - viewRef.current.y) / viewRef.current.scale;

        viewRef.current.scale = clampedScale;
        viewRef.current.x = mx - worldX * clampedScale;
        viewRef.current.y = my - worldY * clampedScale;
      } else {
        viewRef.current.scale = clampedScale;
      }
      drawFrame();
    },
    getView: () => ({ ...viewRef.current }),
    getCanvasKit: () => canvasKitRef.current,
    getSurface: () => surfaceRef.current,
  }));

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <canvas
        ref={canvasRef}
        className="block w-full h-full touch-none select-none"
        onContextMenu={(e) => e.preventDefault()}
        aria-label="Pannable canvas"
      />
    </div>
  );
});