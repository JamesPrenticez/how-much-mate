import { useEffect, useRef } from 'react';
import { CanvasLayerProps } from './layer.types';

interface GridLayerProps extends CanvasLayerProps {
  gridSize?: number;
  gridColor?: string;
}

export const GridLayer = ({
  width,
  height,
  zIndex,
  gridSize = 50,
  gridColor = '#eee'
}: GridLayerProps ) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const dpr = window.devicePixelRatio || 1;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(width, y + 0.5);
      ctx.stroke();
    }
  }, [width, height, gridSize, gridColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex,
        pointerEvents: 'none',
      }}
    />
  );
};