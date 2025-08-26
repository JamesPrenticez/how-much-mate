import styled from '@emotion/styled';
import { PropsWithChildren, useCallback, useRef } from 'react';
import { initialConfig } from '../config';
import { useCanvasKitLoader } from '../loader';
import { useShapesStore } from '../stores';
import { useHover, usePan, useSelection, useShapeMovement, useZoom } from '../hooks';
import { useInteractions } from '../hooks/use-interactions';

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

  // Get no-RAF interaction handlers (BIGGEST PERFORMANCE WIN)
  const interactions = useInteractions();
  const selection = useSelection();

  return (
    <Container
      onMouseDown={(e) => {
        // Handle selection first
        if (e.button === 0) {
          selection.onMouseDown(e);
        }
        // Then handle optimized interactions
        interactions.onMouseDown(e);
      }}
      onMouseMove={interactions.onMouseMove}
      onMouseUp={interactions.onMouseUp}
      onWheel={interactions.onWheel}
      style={{
        height: initialConfig.height + 50,
        width: initialConfig.width + 50,
      }}
    >
      {children}
    </Container>
  );
};
