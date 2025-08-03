import { useEffect, useRef } from 'react';
import { CanvasLayerProps } from './types';
import { CadElement, GeometryType } from '@draw/models';
import type { CanvasKit as CanvasKitType } from 'canvaskit-wasm';
import { useViewport } from './viewport-provider';

interface BackgroundLayerProps extends CanvasLayerProps {
  CanvasKit: CanvasKitType | null;
  cadElements: CadElement[];
  backgroundColor?: [number, number, number];
  strokeColor?: [number, number, number, number];
  strokeWidth?: number;
}

export const BackgroundLayer = ({
  width,
  height,
  zIndex,
  CanvasKit,
  cadElements,
  backgroundColor = [33, 33, 33],
  strokeColor = [0, 255, 0, 1],
  strokeWidth = 2
}: BackgroundLayerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { viewport } = useViewport();

  useEffect(() => {
    if (!CanvasKit || !canvasRef.current) return;

    const surface = CanvasKit.MakeCanvasSurface(canvasRef.current.id);
    if (!surface) return;

    const canvas = surface.getCanvas();
    // canvas.clear(CanvasKit.Color(...backgroundColor));

    // Apply viewport transformation
    canvas.save();
    canvas.translate(viewport.offsetX, viewport.offsetY);
    canvas.scale(viewport.scale, viewport.scale);

    const paint = new CanvasKit.Paint();
    paint.setStyle(CanvasKit.PaintStyle.Stroke);
    paint.setColor(CanvasKit.Color(...strokeColor));
    paint.setStrokeWidth(strokeWidth / viewport.scale); // Keep stroke width consistent

    if (cadElements) {
      for (const el of cadElements) {
        if (el.geometry.type === GeometryType.LINE) {
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
  }, [CanvasKit, cadElements, backgroundColor, strokeColor, strokeWidth, viewport]);

  return (
    <canvas
      id={`skia-canvas-${Math.random()}`} // Unique ID for each instance
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex,
      }}
      width={width}
      height={height}
    />
  );
};