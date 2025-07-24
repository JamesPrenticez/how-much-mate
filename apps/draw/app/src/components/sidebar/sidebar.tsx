import styled from '@emotion/styled';
import { device } from '@shared/hooks';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 1.6rem 2.5rem;
  gap: 1rem;
  width: 30rem;
  max-width: 30rem;

  background-color: var(--color-background-strong);

  user-select: none;

  .title {
    color: var(--color-text-subtle);
    font-size: 2rem;
  }

  @media ${device.tablet} {
    display: none;
  }
`;

export const Sidebar = () => {
  return (
    <Container>
      <div className="title">General</div>
    </Container>
  );
};
