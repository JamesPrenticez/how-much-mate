import styled from "@emotion/styled";
import  { PropsWithChildren, useCallback } from "react";
import { initialConfig } from "../../config";
import { useCanvasKitLoader } from "../../loader";
import { screenToWorld } from "../../utils";
import { useCanvasStore, useShapesStore } from "../../stores";

const Container = styled.div`
  position: relative;

  touch-action: none;
  border: red solid 1px;

  & > * {
    transform: translate(25px, 25px);
  }
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  color: white;
`

export const InteractionLayer = ({ children }: PropsWithChildren) => {
  useCanvasKitLoader();

  const view = useCanvasStore((s) => s.view);

  const hoveredShape = useShapesStore((s) => s.hoveredShape);
  const setHoveredShape = useShapesStore((s) => s.setHoveredShape);
  const quadtree = useShapesStore((s) => s.quadtree);

  const getScreenCoords = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: e.clientX - rect.left - 25, // Account for transform offset TODO remove
      y: e.clientY - rect.top - 25
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!quadtree) return;

    const screenCoords = getScreenCoords(e);
    const worldCoords = screenToWorld(screenCoords.x, screenCoords.y, view);

    // Query small rect around cursor
    const pointerRect = { x: worldCoords.x - 1, y: worldCoords.y - 1, width: 2, height: 2 };
    const candidates = quadtree.query(pointerRect);

    // If multiple candidates, pick topmost (or whatever logic you use)
    const hoveredShape = candidates.length > 0 ? candidates[candidates.length - 1] : null;

    setHoveredShape(hoveredShape);
  }, [quadtree, view, getScreenCoords, setHoveredShape]);

  return (
    <Container
      onMouseMove={handleMouseMove} 
      style={{
        height: initialConfig.height + 50,
        width: initialConfig.width + 50
      }}
    >
      <Overlay>
        <p>{hoveredShape?.id ?? "none"}</p>
      </Overlay>
      {children}
    </Container>
  );
}
