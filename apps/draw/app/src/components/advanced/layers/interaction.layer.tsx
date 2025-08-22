import styled from '@emotion/styled';
import { PropsWithChildren, useCallback, useRef } from 'react';
import { initialConfig } from '../config';
import { useCanvasKitLoader } from '../loader';
import { useShapesStore } from '../stores';
import { useHover, usePan, useSelection, useShapeMovement, useZoom } from '../hooks';

const Container = styled.div`
  position: relative;

  touch-action: none;
  border: red solid 1px;

  & > * {
    transform: translate(25px, 25px);
  }
`;

export const InteractionLayer = ({ children }: PropsWithChildren) => {
  useCanvasKitLoader();

  const hover = useHover();
  const pan = usePan();
  const zoom = useZoom();
  const selection = useSelection();
  const movement = useShapeMovement();

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Try shape movement first (highest priority)
    movement.onMouseDown(e);
    
    // If movement didn't consume the event, try selection
    if (!movement.isDragging()) {
      if (e.button === 0) {
        selection.onMouseDown(e);
      }
    }
    
    // Finally, handle panning (lowest priority)
    if (!movement.isDragging()) {
      pan.onMouseDown(e);
    }
  }, [movement, selection, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Handle movement if we're dragging
    if (movement.isDragging()) {
      movement.onMouseMove(e);
    } else {
      // Otherwise handle pan and hover
      pan.onMouseMove(e);
      if (!e.buttons) {
        hover.onMouseMove(e);
      }
    }
  }, [movement, pan, hover]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    movement.onMouseUp();
    pan.onMouseUp();
  }, [movement, pan]);

  return (
    <Container
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={zoom} 
      onKeyDown={selection.clearSelection}
      
      style={{
        height: initialConfig.height + 50,
        width: initialConfig.width + 50,
      }}
    >
      {children}
    </Container>
  );
};
