import { useEffect, useRef } from 'react';
import { CanvasLayerProps } from './types';
import { useViewportStore } from './viewport.store';

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
  const viewport = useViewportStore((s) => s.viewport);

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

    // Apply viewport transformation  
    ctx.save();
    ctx.translate(viewport.offsetX, viewport.offsetY);
    ctx.scale(viewport.scale, viewport.scale);

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    const scaledGridSize = gridSize;
    const startX = Math.floor(-viewport.offsetX / viewport.scale / scaledGridSize) * scaledGridSize;
    const endX = Math.ceil((width - viewport.offsetX) / viewport.scale / scaledGridSize) * scaledGridSize;
    const startY = Math.floor(-viewport.offsetY / viewport.scale / scaledGridSize) * scaledGridSize;
    const endY = Math.ceil((height - viewport.offsetY) / viewport.scale / scaledGridSize) * scaledGridSize;

    // Vertical lines
    for (let x = startX; x <= endX; x += scaledGridSize) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5 / viewport.scale, startY);
      ctx.lineTo(x + 0.5 / viewport.scale, endY);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = startY; y <= endY; y += scaledGridSize) {
      ctx.beginPath();
      ctx.moveTo(startX, y + 0.5 / viewport.scale);
      ctx.lineTo(endX, y + 0.5 / viewport.scale);
      ctx.stroke();
    }

  }, [width, height, gridSize, gridColor, viewport]);

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