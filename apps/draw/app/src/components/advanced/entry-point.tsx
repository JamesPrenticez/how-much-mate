import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { InteractionLayer } from './layers/interaction.layer';
import { useShapesStore } from './stores';
import { mockShapes } from './shapes.mock';
import { Canvas } from './layers';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #f5f5f5;
`;

const LoadingOverlay = styled.div<{ show: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease;
  
  div {
    text-align: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    
    h3 {
      margin: 0 0 8px 0;
      color: #333;
    }
    
    p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
  }
`;

const ControlPanel = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 12px;
  border-radius: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 12px;
  backdrop-filter: blur(4px);
  border: 1px solid #ddd;
  z-index: 1000;
  
  button {
    background: #007bff;
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    cursor: pointer;
    margin-top: 4px;
    
    &:hover {
      background: #0056b3;
    }
  }
`;

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

  // Generate more shapes for stress testing
  const generateMoreShapes = () => {
    const currentShapes = useShapesStore.getState().shapes;
    const newShapes = Array.from({ length: 500 }, (_, i) => ({
      id: currentShapes.length + i + 1,
      type: 'rectangle' as const,
      x: Math.floor(Math.random() * 2000 - 1000),
      y: Math.floor(Math.random() * 1000 - 500),
      width: Math.floor(Math.random() * 50) + 10,
      height: Math.floor(Math.random() * 50) + 10,
      color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
      selected: false,
    }));
    
    setShapes([...currentShapes, ...newShapes]);
  };

  return (
    <Container>
      <LoadingOverlay show={isLoading}>
        <div>
          <h3>🚀 Initializing High-Performance Canvas</h3>
          <p>Loading {mockShapes.length} shapes and building spatial index...</p>
          {loadTime > 0 && (
            <p style={{ marginTop: '8px', color: '#007bff' }}>
              Loaded in {loadTime.toFixed(2)}ms
            </p>
          )}
        </div>
      </LoadingOverlay>
      
      <ControlPanel>
        <button onClick={generateMoreShapes}>
          Add 500 More Shapes
        </button>
      </ControlPanel>

      <InteractionLayer>
        <Canvas />
      </InteractionLayer>

    </Container>
  );
};