import { InteractionLayer } from './layers/interaction/interaction.layer';
import { CanvasLayer } from './layers/canvas.layer';
import { drawSimpleRect1, drawSimpleRect3 } from './draw';
import { useShapesStore } from './stores';
import { drawGeometry } from './draw/draw-geometry';

import { mockShapes } from './shapes.mock';
import { useEffect } from 'react';

export const EntryPoint = () => {
  const setShapes = useShapesStore((s) => s.setShapes);
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
      <CanvasLayer
        id="grid-layer"
        draw={drawSimpleRect1}
        borderColor="fuchsia"
      />

      <CanvasLayer
        id="background-layer"
        draw={drawGeometry(quadtree)} //hmm
        borderColor="cyan"
      />

      <CanvasLayer id="edit-layer" draw={drawSimpleRect3} borderColor="cyan" />
    </InteractionLayer>
  );
};
