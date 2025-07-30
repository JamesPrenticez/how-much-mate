import { useElementStore } from "@draw/stores";
import styled from "@emotion/styled";
import { Grid } from "@grid";

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

  h1 {
    font-size: 3rem;
    font-weight: 600;
    font-family: 'Quicksand', sans-serif;
  }
`;


export const ElementsPage = () => {
  const { elements } = useElementStore();

  console.log(elements)

  return (
    <Container>
          <Grid
              data={elements}
              columnOrder={[
                'name',
                'description',
              ]}
              initialColumnWidths={{
                name: '330px',
                description: '1fr',
              }}
            />
    </Container>
  )
}