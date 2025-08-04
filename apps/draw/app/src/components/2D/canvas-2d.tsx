import React, { useEffect, useState } from 'react';
import { loadCanvasKit } from './canvas-kit-loader';
import { CadElement } from '@draw/models';
import type { CanvasKit as CanvasKitType } from 'canvaskit-wasm';
import { BackgroundLayer, GridLayer, InteractionLayer } from './layers';
import { ViewportLimits } from './layers/types';
import { ViewportProvider } from './layers/viewport-provider';
import { ViewportControls } from './layers/viewport-controls';
import { initializeViewport, useViewportStore } from './layers/viewport.store';

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 800;

interface Canvas2DProps {
  cadElements: CadElement[];
  width?: number;
  height?: number;
  initialZoom?: number;
  zoomLimits?: Partial<ViewportLimits>;
  showControls?: boolean;
}

export const Canvas2D: React.FC<Canvas2DProps> = ({
  cadElements,
  width = CANVAS_WIDTH,
  height = CANVAS_HEIGHT,
  initialZoom = 1,
  zoomLimits,
  showControls = true
}) => {
  const [CanvasKit, setCanvasKit] = useState<CanvasKitType | null>(null);
  const screenToWorld = useViewportStore((state) => state.screenToWorld);

  // Load CanvasKit WASM
  useEffect(() => {
    loadCanvasKit().then(setCanvasKit);
  }, []);

  const handleMouseDown = (x: number, y: number) => {
    console.log('Canvas MouseDown at world coordinates:', x, y);
    // TODO: hit test, select cadElement
  };

  const handleMouseMove = (x: number, y: number) => {
    // TODO: handle mouse move (hover effects, drag operations)
  };

  const handleMouseUp = (x: number, y: number) => {
    // TODO: handle mouse up (end drag operations)
  };

    // Initialize viewport on mount
  useEffect(() => {
    initializeViewport(initialZoom, zoomLimits);
  }, [initialZoom, zoomLimits]);

  return (
    <div
      style={{
        backgroundColor: "var(--color-background-strong)",
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
      }}
    >

      <GridLayer
        width={width}
        height={height}
        zIndex={0}
      />

      <BackgroundLayer
        width={width}
        height={height}
        zIndex={1}
        CanvasKit={CanvasKit}
        cadElements={cadElements}
      />

      <InteractionLayer
        width={width}
        height={height}
        zIndex={2}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

      {showControls && <ViewportControls />}
    </div>
  );
};