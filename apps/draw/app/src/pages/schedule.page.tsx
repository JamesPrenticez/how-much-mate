import { useElementStore } from "@draw/stores";
import styled from "@emotion/styled";

const Container = styled.div`
  border: solid 0.2rem var(--color-border);
  border-radius: 0.5rem;
  width: 80%;
  margin: 2rem auto;
  color: var(--color-text-subtle);
  font-size: 2rem;
  background-color: var(--color-background-weak);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  .scroll-container {
    max-height: 75rem;
    overflow-y: auto;
  }

  h1 {
    font-size: 3rem;
    font-weight: 600;
    font-family: 'Quicksand', sans-serif;
    text-transform: uppercase;
  }
`;

export const SchedulePage = () => {
  const { elements, subs } = useElementStore();

  return (
    <Container>
      <h1>Schedule of Quantities</h1>

      <div className="scroll-container custom-scrollbar-narrow">
        <pre>{JSON.stringify(elements, null, 2)}</pre>
      </div>
    </Container>
  )
}