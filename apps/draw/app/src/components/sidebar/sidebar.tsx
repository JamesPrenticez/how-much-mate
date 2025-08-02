import styled from '@emotion/styled';
import { device } from '@shared/hooks';
import { ElementGroups } from './element-groups';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 0rem 1rem;
  gap: 1rem;
  width: 32rem;
  max-width: 30rem;

  background-color: var(--color-background-strong);

  user-select: none;

.test {
  background-color: red;
}

  @media ${device.tablet} {
    display: none;
  }
`;

export const Sidebar = () => {
  return (
    <Container>
      <ElementGroups />
    </Container>
  );
};
