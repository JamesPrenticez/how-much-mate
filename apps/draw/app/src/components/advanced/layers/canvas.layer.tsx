import { useEffect, useRef } from 'react'
import styled from '@emotion/styled';
import { initialConfig } from "../config";
import { useCanvasStore } from '../canvas.store';
import { DrawFunction } from '../models';

const StyledCanvas = styled.canvas`
  position: absolute;
  border: 1px solid red;
`

interface CanvasLayerProps {
  draw: DrawFunction;
  borderColor: string;
}

export const CanvasLayer = ({
  draw,
  borderColor
}: CanvasLayerProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const canvasKit = useCanvasStore((s) => s.canvasKit);
  const view = useCanvasStore((s) => s.view);

  useEffect(() => {
    if (!canvasKit || !canvasRef.current) return;

    const surface = canvasKit.MakeCanvasSurface(canvasRef.current);
    if (!surface) return;

    const canvas = surface.getCanvas();
    canvas.clear(canvasKit.TRANSPARENT);

    canvas.save();
    canvas.translate(view.x, view.y);
    canvas.scale(view.scale, view.scale);

    // Draw
    draw(canvas, canvasKit);

    canvas.restore();
    
    // Force a flush to ensure drawing happens
    surface.flush();

    // Return cleanup function that will dispose the surface
    return () => {
      surface.dispose(); // Use dispose(), not flush()
    };
  }, [canvasKit, view]);

  return (
      <StyledCanvas
        ref={canvasRef}
        onContextMenu={(e) => e.preventDefault()}
        width={initialConfig.width}
        height={initialConfig.height}
        style={{ borderColor }}
      />
  )
}
