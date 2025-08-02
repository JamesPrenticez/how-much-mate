import styled from '@emotion/styled';
import { ElementGroup } from './element-group';
import { useElementStore } from '@draw/stores';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: var(--color-background-weak);
  color: var(--color-text);
  padding: 0.5rem;

  h1 {
    font-size: 1.4rem;
    color: var(--color-primary);
  }
`;

const ScrollContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: var(--color-background-weak);
  border-radius: 0.5rem;
  gap: 0.2rem;
  padding-right: 0.5rem;

  overflow-y: scroll;
  overflow-x: hidden;
`;

export const ElementPanel = () => {
  const { elements } = useElementStore();
console.log(elements)
  if (!elements) return <div>No Element Groups...</div>;

  return (
    <Container>
      <h1>Element Panel</h1>

      <ScrollContainer className="custom-scrollbar-narrow">
        {elements.map((element) => (
          <ElementGroup 
            key={element.id}
            element={element}
          />
        ))}
      </ScrollContainer>
    </Container>
  );
};
