import React, { useCallback, useRef, useState } from 'react';
import { CanvasLayerProps } from './types';
import { useViewport } from './viewport-provider';

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
  const { viewport, setPan, zoomIn, zoomOut, screenToWorld } = useViewport();
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x: screenX, y: screenY } = getCanvasCoordinates(e);
    const worldCoords = screenToWorld(screenX, screenY);

    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // Middle mouse or Ctrl+Left mouse for panning
      setIsPanning(true);
      setLastPanPoint({ x: screenX, y: screenY });
      e.preventDefault();
    } else {
      onMouseDown?.(worldCoords.x, worldCoords.y, e);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x: screenX, y: screenY } = getCanvasCoordinates(e);
    
    if (isPanning) {
      const deltaX = screenX - lastPanPoint.x;
      const deltaY = screenY - lastPanPoint.y;
      setPan(viewport.offsetX + deltaX, viewport.offsetY + deltaY);
      setLastPanPoint({ x: screenX, y: screenY });
    } else {
      const worldCoords = screenToWorld(screenX, screenY);
      onMouseMove?.(worldCoords.x, worldCoords.y, e);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x: screenX, y: screenY } = getCanvasCoordinates(e);
    const worldCoords = screenToWorld(screenX, screenY);

    if (isPanning) {
      setIsPanning(false);
    } else {
      onMouseUp?.(worldCoords.x, worldCoords.y, e); // what does this do for us?
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x: screenX, y: screenY } = getCanvasCoordinates(e);
    const worldCoords = screenToWorld(screenX, screenY);
    onClick?.(worldCoords.x, worldCoords.y, e);
  };

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const { x: screenX, y: screenY } = getCanvasCoordinates(e);
    
    if (e.deltaY < 0) {
      zoomIn(screenX, screenY);
    } else {
      zoomOut(screenX, screenY);
    }
  }, [zoomIn, zoomOut]);

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
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()} // Prevent client right-click menu - we could add our own here
    />
  );
};