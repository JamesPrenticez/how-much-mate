import styled from "@emotion/styled";
import { PropsWithChildren } from "react";

const Container = styled.div`
  color: var(--color-text-subtle);
  font-size: 2rem;
  background-color: var(--color-background-weak);
  padding: 1rem;

  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  overflow-y: auto;

  h1 {
    font-size: 3rem;
    font-weight: 600;
    font-family: 'Quicksand', sans-serif;
    text-transform: uppercase;
  }
`;

export const PageContainer = ({ children }: PropsWithChildren) => {
  return (
    <Container className="custom-scrollbar-narrow">{children}</Container>
  )
};