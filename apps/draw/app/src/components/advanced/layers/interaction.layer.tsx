import styled from '@emotion/styled';
import { PropsWithChildren, useCallback, useRef } from 'react';
import { initialConfig } from '../config';
import { useCanvasKitLoader } from '../loader';
import { useShapesStore } from '../stores';
import { useHover, usePan, useSelection, useZoom } from '../hooks';

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

  return (
    <Container
      onMouseDown={(e) => {
        // Handle selection on left click
        if (e.button === 0) {
          selection.onMouseDown(e);
        }
        // Handle panning on middle click (or if selection didn't consume the event)
        pan.onMouseDown(e);
      }}
      onMouseMove={(e) => {
        pan.onMouseMove(e);
        if (!e.buttons) hover.onMouseMove(e); // only hover when not dragging
      }}
      onWheel={zoom} 
      onMouseUp={pan.onMouseUp}
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
