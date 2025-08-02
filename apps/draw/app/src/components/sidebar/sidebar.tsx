import styled from '@emotion/styled';
import { device } from '@shared/hooks';
import { PlanPanel } from './plan-panel.tsx/plan-panel';
import { ElementPanel } from './element-panel/element-panel';
import { InfoPanel } from './info-panel/info-panel';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 0rem 1rem;
  gap: 1rem;
  width: 32rem;
  max-width: 30rem;
  margin-bottom: 1rem;

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
      <PlanPanel />
      <ElementPanel />
      <InfoPanel />
    </Container>
  );
};
