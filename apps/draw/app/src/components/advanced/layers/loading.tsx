import styled from '@emotion/styled';

const Container = styled.div<{ show: boolean }>`
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
    font-family: "Quicksand", sans-serif;
    
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

interface LoadingProps {
  isLoading: boolean;
  shapeCount: number;
  loadTime: number;
}

export const LoadingOverlay = ({isLoading, shapeCount, loadTime}: LoadingProps) => {
  return (
      <Container show={isLoading}>
        <div>
          <h3>🚀 Initializing High-Performance Canvas</h3>
          <p>Loading {shapeCount} shapes and building spatial index...</p>
          {loadTime > 0 && (
            <p style={{ marginTop: '8px', color: '#007bff' }}>
              Loaded in {loadTime.toFixed(2)}ms
            </p>
          )}
        </div>
      </Container>
  )
}