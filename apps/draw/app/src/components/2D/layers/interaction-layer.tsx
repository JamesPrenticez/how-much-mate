import React, { useRef } from 'react';
import { CanvasLayerProps } from './layer.types';

interface InteractionLayerProps extends CanvasLayerProps {
  onMouseDown?: (x: number, y: number, event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove?: (x: number, y: number, event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp?: (x: number, y: number, event: React.MouseEvent<HTMLCanvasElement>) => void;
  onClick?: (x: number, y: number, event: React.MouseEvent<HTMLCanvasElement>) => void;
}

export const InteractionLayer = ({
  width,
  height,
  zIndex,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onClick
}: InteractionLayerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoordinates(e);
    console.log('MouseDown at:', x, y);
    onMouseDown?.(x, y, e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoordinates(e);
    onMouseMove?.(x, y, e);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoordinates(e);
    onMouseUp?.(x, y, e);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoordinates(e);
    onClick?.(x, y, e);
  };

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex,
        cursor: 'crosshair',
      }}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
    />
  );
};