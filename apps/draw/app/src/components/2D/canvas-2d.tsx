import React, { useEffect, useState } from 'react';
import { loadCanvasKit } from './canvas-kit-loader';
import { CadElement } from '@draw/models';
import type { CanvasKit as CanvasKitType } from 'canvaskit-wasm';
import { BackgroundLayer, GridLayer, InteractionLayer } from './layers';

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 800;

interface Canvas2DProps {
  cadElements: CadElement[];
  width?: number;
  height?: number;
}

export const Canvas2D: React.FC<Canvas2DProps> = ({
  cadElements,
  width = CANVAS_WIDTH,
  height = CANVAS_HEIGHT
}) => {
  const [CanvasKit, setCanvasKit] = useState<CanvasKitType | null>(null);

  // Load CanvasKit WASM
  useEffect(() => {
    loadCanvasKit().then(setCanvasKit);
  }, []);

  const handleMouseDown = (x: number, y: number) => {
    console.log('Canvas MouseDown at:', x, y);
    // TODO: hit test, select cadElement
  };

  const handleMouseMove = (x: number, y: number) => {
    // TODO: handle mouse move (hover effects, drag operations)
  };

  const handleMouseUp = (x: number, y: number) => {
    // TODO: handle mouse up (end drag operations)
  };

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
      }}
    >
      <BackgroundLayer
        width={width}
        height={height}
        zIndex={0}
        CanvasKit={CanvasKit}
        cadElements={cadElements}
      />

      <GridLayer
        width={width}
        height={height}
        zIndex={1}
      />

      <InteractionLayer
        width={width}
        height={height}
        zIndex={2}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};