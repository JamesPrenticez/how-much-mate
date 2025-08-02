import { CadElement as ICadElement } from '@draw/models';
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

  // TODO switch on the different types

  return (
    <Container>
      {cadElement.geometry.type} - {cadElement?.length}
    </Container>
  )
}
