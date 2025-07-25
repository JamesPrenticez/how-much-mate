import styled from '@emotion/styled';
import { device } from '@shared/hooks';
import { EntitesList } from './entities.list';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 1.6rem 2.2rem;
  gap: 1rem;
  width: 30rem;
  max-width: 30rem;

  background-color: var(--color-background-strong);

  user-select: none;

  .title {
    color: var(--color-primary);
    line-height: 1rem;
    font-size: 2rem;
  }

  @media ${device.tablet} {
    display: none;
  }
`;

export const Sidebar = () => {
  return (
    <Container>
      <div className="title">Elements</div>
      <EntitesList />
    </Container>
  );
};
