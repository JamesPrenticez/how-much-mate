import { useEffect, useRef } from 'react';
import { Surface, CanvasKit } from 'canvaskit-wasm';
import { loadCanvasKit } from './canvas-kit-loader';

let CanvasKitInstance: CanvasKit;

export const Canvas2D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const surfaceRef = useRef<Surface | null>(null);

  useEffect(() => {
    let mounted = true;

    const setup = async () => {
      CanvasKitInstance = await loadCanvasKit();
      if (!canvasRef.current || !mounted) return;

      const surface = CanvasKitInstance.MakeCanvasSurface(canvasRef.current);
      if (!surface) return;
      surfaceRef.current = surface;

      const canvas = surface.getCanvas();

      const drawFrame = () => {
        // Clear background
        canvas.clear(CanvasKitInstance.WHITE);

        // Background Layer (e.g., fill, image, etc)
        const paint = new CanvasKitInstance.Paint();
        paint.setColor(CanvasKitInstance.Color4f(0.95, 0.95, 0.95, 1));
        canvas.drawRect(CanvasKitInstance.LTRBRect(0, 0, 2000, 2000), paint);

        // Grid Layer
        paint.setColor(CanvasKitInstance.Color4f(0.8, 0.8, 0.8, 1));
        paint.setStrokeWidth(1);
        for (let x = 0; x < 2000; x += 50) {
          canvas.drawLine(x, 0, x, 2000, paint);
        }
        for (let y = 0; y < 2000; y += 50) {
          canvas.drawLine(0, y, 2000, y, paint);
        }

        // CAD Elements Layer (just sample lines for now)
        paint.setColor(CanvasKitInstance.Color4f(0, 0, 0, 1));
        paint.setStrokeWidth(2);
        canvas.drawLine(100, 100, 400, 400, paint);
        canvas.drawLine(400, 100, 100, 400, paint);

        // Interaction Layer (e.g., selected box or hover)
        paint.setColor(CanvasKitInstance.Color4f(1, 0, 0, 1));
        paint.setStyle(CanvasKitInstance.PaintStyle.Stroke);
        paint.setStrokeWidth(2);
        canvas.drawRect(CanvasKitInstance.LTRBRect(90, 90, 410, 410), paint);

        surface.flush();
        requestAnimationFrame(drawFrame);
      };

      requestAnimationFrame(drawFrame);
    };

    setup();
    return () => {
      mounted = false;
      surfaceRef.current?.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} width={2000} height={2000} style={{ width: '100%', height: '100%' }} />;
};
