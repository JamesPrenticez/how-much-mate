import styled from '@emotion/styled';
import { useShapesStore } from '../advanced/stores';

const Container = styled.div`
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

export const ControlPanel = () => {
  const setShapes = useShapesStore((s) => s.setShapes);

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
      color: `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')}`,
      selected: false,
      zIndex: i,
    }));

    setShapes([...currentShapes, ...newShapes]);
  };

  return (
    <Container>
      {' '}
      <button onClick={generateMoreShapes}>Add 500 More Shapes</button>
    </Container>
  );
};
