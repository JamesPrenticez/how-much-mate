import React, {
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';

type View = { x: number; y: number; scale: number };

type Props = {
  width: number;
  height: number;
  draw: (ctx: CanvasRenderingContext2D, view: View, dpr: number) => void;
  initialScale?: number;
  initialX?: number;
  initialY?: number;
  className?: string;
  background?: string;
  enableZoom?: boolean;
  wheelZoomFactor?: number;
  minZoom?: number;
  maxZoom?: number;
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export const PannableCanvasKit = forwardRef(function PannableCanvasKit(
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
  }: Props,
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dprRef = useRef<number>(1);

  // Clamp initial scale
  const initialClampedScale = clamp(initialScale, minZoom, maxZoom);
  const viewRef = useRef<View>({
    x: initialX,
    y: initialY,
    scale: initialClampedScale,
  });

  const pointerActiveRef = useRef(false);
  const lastPointerPos = useRef<{ x: number; y: number } | null>(null);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas properly
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (background === 'transparent') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const { x, y, scale } = viewRef.current;

    // Apply transform: scale first, then translate in world coords
    ctx.setTransform(
      scale * dprRef.current,
      0,
      0,
      scale * dprRef.current,
      x * dprRef.current,
      y * dprRef.current
    );

    draw(ctx, viewRef.current, dprRef.current);
  }, [background, draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const setSize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      dprRef.current = dpr;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      drawFrame();
    };
    setSize();
    window.addEventListener('resize', setSize);
    return () => window.removeEventListener('resize', setSize);
  }, [width, height, drawFrame]);

  // Panning: track pointer position, update view.x/y (world space)
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

      // Panning offsets are in screen space and should be applied directly to the view offset
      // The view offset (x, y) represents the screen position of world origin (0, 0)
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

  // Wheel zoom, anchored to mouse, with clamping
  useEffect(() => {
    if (!enableZoom) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault();

      const canvas = canvasRef.current;
      if (!canvas) return;

      const { scale, x, y } = viewRef.current;

      // Get mouse position relative to canvas
      const rect = canvas.getBoundingClientRect();
      const mouseX = ev.clientX - rect.left;
      const mouseY = ev.clientY - rect.top;

      // Convert mouse position to world coordinates BEFORE zoom
      // The current transform is: screenX = worldX * scale + x
      // So: worldX = (screenX - x) / scale
      const worldMouseX = (mouseX - x) / scale;
      const worldMouseY = (mouseY - y) / scale;

      // Calculate new scale based on wheel delta
      const zoomAmount = 1 - ev.deltaY * wheelZoomFactor;
      let newScale = scale * zoomAmount;
      newScale = clamp(newScale, minZoom, maxZoom);

      // Calculate new view offset so that the world point under the mouse
      // appears at the same screen position after zoom
      // We want: mouseX = worldMouseX * newScale + newX
      // So: newX = mouseX - worldMouseX * newScale
      const newX = mouseX - worldMouseX * newScale;
      const newY = mouseY - worldMouseY * newScale;

      viewRef.current.x = newX;
      viewRef.current.y = newY;
      viewRef.current.scale = newScale;

      drawFrame();
    };

    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheel as EventListener);
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

        // Convert mouse pos to world coords before zoom
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
  }));

  useEffect(() => {
    drawFrame();
  }, [drawFrame]);

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
