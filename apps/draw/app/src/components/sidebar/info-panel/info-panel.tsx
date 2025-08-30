import styled from '@emotion/styled';
import { useShapesStore } from '../../advanced/stores';

const Container = styled.div`
  height: 20rem;
  background-color: var(--color-background-weak);
  color: var(--color-text);
  padding: 0.5rem;

  h1 {
    font-size: 1.4rem;
    color: var(--color-primary);
  }
`;

const ShapeInfo = styled.div`
  font-size: 1.4rem;

  .base-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-transform: capitalize;

    .color-swatch {
      height: 1rem;
      width: 1rem;
    }
  }
`;

export const InfoPanel = () => {
  const selectedShape = useShapesStore((s) => s.selectedShape);

  return (
    <Container>
      <h1>Info Panel</h1>

      {selectedShape && (
        <ShapeInfo>
          <div>
            <b>ID:</b> {selectedShape.id}
          </div>
          <div className="base-info">
            <div className="type">
              {selectedShape.type}
            </div>
            <div
              className="color-swatch"
              style={{ backgroundColor: selectedShape.color }}
            />
          </div>
        </ShapeInfo>
      )}
    </Container>
  );
};
