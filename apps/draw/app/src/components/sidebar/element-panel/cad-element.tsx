import { GeometryType, CadElement as ICadElement } from '@draw/models';
import styled from '@emotion/styled';

const Container = styled.div`
  background-color: var(--color-background-weak);
  border-radius: 0.5rem;
  font-size: 1.2rem;
  color: var(--color-);
`;

interface CadElementProps {
  cadElement: ICadElement;
}

export const CadElement = ({ cadElement }: CadElementProps) => {
  let render;

  switch (cadElement.geometry.type) {
    case GeometryType.LINE:
      render = (
        <div>
          {cadElement.geometry.type} - start: x:{cadElement.geometry.start.x},
          y: {cadElement.geometry.start.y} &nbsp; end: x:
          {cadElement.geometry.end.x}, y: {cadElement.geometry.end.y}
        </div>
      );
      break;
    case GeometryType.POLYLINE:
    case GeometryType.RECTANGLE:
      break;
    default:
      console.log(`Unsupported Geometry Type.`);
  }
  return <Container>{render}</Container>;
};
