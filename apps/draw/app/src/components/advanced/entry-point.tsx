import { useEffect } from 'react';
import { InteractionLayer } from './layers/interaction.layer';
import { useShapesStore } from './stores';

import { mockShapes2 } from './shapes2.mock';
import { Canvas } from './layers';

export const EntryPoint = () => {
  const setShapes = useShapesStore((s) => s.setShapes);

  // This is just a mock API call for now
  // We need to set the shapes in order to trigger building the quad tree
  useEffect(() => {
    try {
      setShapes(mockShapes2);
    } catch (err) {
      console.error("Failed to set mock shapes", err);
    }
  }, [setShapes]);

  return (
    <InteractionLayer>
      <Canvas />
    </InteractionLayer>
  );
};
