import { useEffect } from 'react';

export const useCanvasKitInit = (
  width: number,
  height: number,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  canvasKitRef: React.MutableRefObject<any>,
  dprRef: React.MutableRefObject<number>,
  surfaceRef: React.MutableRefObject<any>,
  drawFrame: () => void,
  loadCanvasKit: () => Promise<any>
) => {
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const CanvasKit = await loadCanvasKit();
        if (!mounted) return;

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
  }, [width, height, drawFrame, loadCanvasKit]);
}
