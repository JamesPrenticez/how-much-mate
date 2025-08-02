import React, { useEffect, useRef, useState } from 'react';
import { loadCanvasKit } from './canvas-kit-loader';
import { CadElement, GeometryType } from '@draw/models';
import type { CanvasKit as CanvasKitType } from 'canvaskit-wasm';
import { getCssColorValues } from './use-css-color.util';
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 800;

export const Canvas2D = ({ cadElements }: { cadElements: CadElement[] }) => {
  const gridRef = useRef<HTMLCanvasElement>(null);
  const interactionRef = useRef<HTMLCanvasElement>(null);
  const backgroundRef = useRef<HTMLCanvasElement>(null); // Skia draws here

  const [CanvasKit, setCanvasKit] = useState<CanvasKitType | null>(null); // hmm whats the type here?

  // Load CanvasKit WASM
  useEffect(() => {
    loadCanvasKit().then(setCanvasKit);
  }, []);

  // Render Background (CanvasKit)
  useEffect(() => {
    if (!CanvasKit || !backgroundRef.current) return;

    const surface = CanvasKit.MakeCanvasSurface(backgroundRef.current.id);
    if (!surface) return;

    const canvas = surface.getCanvas();
    // TODO canvas.clear(CanvasKit.Color(...getCssColorValues('--color-background-strong-opacity'), 1));
    canvas.clear(CanvasKit.Color(33, 33, 33));

    const paint = new CanvasKit.Paint();
    paint.setStyle(CanvasKit.PaintStyle.Stroke);
    paint.setColor(CanvasKit.Color(0, 255, 0, 1));
    paint.setStrokeWidth(2);

    if(cadElements) {
      for (const el of cadElements) {
        if(el.geometry.type === GeometryType.LINE) {
          const path = new CanvasKit.Path();
          path.moveTo(el.geometry.start.x, el.geometry.start.y);
          path.lineTo(el.geometry.end.x, el.geometry.end.y);
          canvas.drawPath(path, paint);
          path.delete();
        }
      }
    }

    surface.flush();
    paint.delete();
  }, [CanvasKit, cadElements]);

  // Render Grid (2D)
  useEffect(() => {
    const dpr = window.devicePixelRatio || 1;
    const gridCanvas = gridRef.current;
    if (!gridCanvas) return;

    gridCanvas.width = CANVAS_WIDTH * dpr;
    gridCanvas.height = CANVAS_HEIGHT * dpr;
    gridCanvas.style.width = `${CANVAS_WIDTH}px`;
    gridCanvas.style.height = `${CANVAS_HEIGHT}px`;

    const ctx = gridCanvas.getContext('2d')!;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    for (let x = 0; x < CANVAS_WIDTH; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(CANVAS_WIDTH, y + 0.5);
      ctx.stroke();
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log('MouseDown at:', x, y);
    // TODO: hit test, select cadElement
  };

  return (
    <div
      style={{
        position: 'relative',
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
      }}
    >
      {/* CanvasKit (Skia) background */}
      <canvas
        id="skia-canvas"
        ref={backgroundRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />

      {/* Grid overlay */}
      <canvas
        ref={gridRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Interaction layer */}
      <canvas
        ref={interactionRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 2,
        }}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};
