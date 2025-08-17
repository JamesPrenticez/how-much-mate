import { useEffect } from 'react';
import { InteractionLayer } from './layers/interaction.layer';
import { CanvasLayer } from './layers/canvas.layer';
import { useShapesStore } from './stores';

import { drawGeometry, drawHoveredOutline, drawSelectedOutline } from './draw';

import { mockShapes } from './shapes.mock';

export const EntryPoint = () => {
  const setShapes = useShapesStore((s) => s.setShapes);
  const hoveredShape = useShapesStore((s) => s.hoveredShape);
  const selectedShape = useShapesStore((s) => s.selectedShape);

  const quadtree = useShapesStore((s) => s.quadtree); // This is effectivly visiable shapes

  // This is just a mock API call for now
  // We need to set the shapes in order to trigger building the quad tree
  useEffect(() => {
    try {
      setShapes(mockShapes);
    } catch (err) {
      console.error("Failed to set mock shapes", err);
    }
  }, [setShapes]);

  return (
    <InteractionLayer>
      {/* <CanvasLayer
        id="grid-layer"
        draw={drawSimpleRect1}
        borderColor="fuchsia"
      /> */}

      <CanvasLayer
        id="background-layer"
        draw={drawGeometry(quadtree)}
        borderColor="cyan"
      />

      <CanvasLayer 
        id="hover-layer"
        draw={drawHoveredOutline(hoveredShape)}
        borderColor="cyan"
      />

      <CanvasLayer 
        id="selected-layer"
        draw={drawSelectedOutline(selectedShape)}
        borderColor="cyan"
      />

    </InteractionLayer>
  );
};
