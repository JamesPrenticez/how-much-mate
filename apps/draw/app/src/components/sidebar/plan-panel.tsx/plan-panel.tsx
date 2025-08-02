import styled from "@emotion/styled"

const Container = styled.div`
  height: 20rem;
  background-color: var(--color-background-weak);
  color: var(--color-text);
  padding: 0.5rem;
  
  h1 {
    font-size: 1.4rem;
    color: var(--color-primary);
  }
`

export const PlanPanel = () => {
  return (
    <Container>
      <h1>
        Plan Panel
      </h1>
        
    </Container>
  )
}