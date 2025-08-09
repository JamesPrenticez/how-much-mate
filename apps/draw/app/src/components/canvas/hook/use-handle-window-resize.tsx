import { useEffect, MutableRefObject } from 'react';
import { CanvasKitInstance, Surface } from '../types';

interface UseCanvasKitResizeParams {
  width: number;
  height: number;
  drawFrame: () => void;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  canvasKitRef: MutableRefObject<CanvasKitInstance | null>;
  surfaceRef: MutableRefObject<Surface | null>;
  dprRef: MutableRefObject<number>;
}

export const useHandleWindowResize = ({
  width,
  height,
  drawFrame,
  canvasRef,
  canvasKitRef,
  surfaceRef,
  dprRef
}: UseCanvasKitResizeParams) => {
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
  }, [width, height, drawFrame, canvasRef, canvasKitRef, surfaceRef, dprRef]);
};