import styled from '@emotion/styled';
import { PropsWithChildren } from 'react';
import { initialConfig } from '../config';
import { useCanvasKitLoader } from '../loader';
import { useShapesStore } from '../stores';
import { useHover, usePan, useZoom } from '../hooks';

const Container = styled.div`
  position: relative;

  touch-action: none;
  border: red solid 1px;

  & > * {
    transform: translate(25px, 25px);
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  color: white;
`;

export const InteractionLayer = ({ children }: PropsWithChildren) => {
  useCanvasKitLoader();

  const hover = useHover();
  const pan = usePan();
  useZoom();

  return (
    <Container
      onMouseDown={pan.onMouseDown}
      onMouseMove={(e) => {
        pan.onMouseMove(e);
        if (!e.buttons) hover.onMouseMove(e); // only hover when not dragging
      }}
      onMouseUp={pan.onMouseUp}
      style={{
        height: initialConfig.height + 50,
        width: initialConfig.width + 50,
      }}
    >
      <Overlay>
        <p>{useShapesStore.getState().hoveredShape?.id ?? 'none'}</p>
      </Overlay>
      {children}
    </Container>
  );
};
