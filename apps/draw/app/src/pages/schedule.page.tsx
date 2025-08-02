import { useOrgStore } from "@draw/stores";
import styled from "@emotion/styled";

const Container = styled.div``;

export const SchedulePage = () => {
  const { all } = useOrgStore();

  return (
    <Container>
      <h1>Schedule of Quantities</h1>
      <pre>{JSON.stringify(all, null, 2)}</pre>
    </Container>
  )
}