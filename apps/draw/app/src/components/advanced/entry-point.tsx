import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { InteractionLayer } from './layers/interaction.layer';
import { useShapesStore } from './stores';
import { mockShapes } from './shapes.mock';
import { Canvas } from './layers';
import { ControlPanel } from '../control-panel/control-panel';
import { LoadingOverlay } from './layers/loading';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: var(--color-background);
`;

const SHOW_CONTROL_PANEL = true;

export const EntryPoint = () => {
  const setShapes = useShapesStore((s) => s.setShapes);
  const [isLoading, setIsLoading] = useState(true);
  const [loadTime, setLoadTime] = useState(0);

  // Initialize shapes with performance tracking
  useEffect(() => {
    const startTime = performance.now();
    
    const loadShapes = async () => {
      try {
        // Simulate some async loading time to show the loading state
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setShapes(mockShapes);
        
        const endTime = performance.now();
        setLoadTime(endTime - startTime);
        
        // Hide loading after a brief delay to show the metrics
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
        
        console.log(`Shapes loaded and quadtree built in ${(endTime - startTime).toFixed(2)}ms`);
      } catch (err) {
        console.error("Failed to set mock shapes", err);
        setIsLoading(false);
      }
    };

    loadShapes();
  }, [setShapes]);



  return (
    <Container>

      <LoadingOverlay
        isLoading={isLoading}
        shapeCount={mockShapes.length ?? 0}
        loadTime={loadTime}
      />

      <InteractionLayer>
        <Canvas />
      </InteractionLayer>

      {SHOW_CONTROL_PANEL && <ControlPanel />}

    </Container>
  );
};