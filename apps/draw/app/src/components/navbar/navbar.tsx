import styled from '@emotion/styled';
import { device } from '@shared/hooks';
import { NavLogo } from './navbar-logo';
import { OranisationPanel } from './account-menu/oranisation-panel';
import { ProjectPanel } from './project-panel';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0rem 2rem 0rem 0rem;
  height: 6rem;
  gap: 0.5rem;
  background-color: var(--color-background-strong);

.center {
  width: 50rem;
}

  .right {
  }

  @media ${device.tablet} {
    padding: 0rem 1rem;
    height: 5rem;
  }
`;

export const Navbar = () => {
  return (
    <Container>
      <NavLogo />

      <div className='center'>
        <ProjectPanel />
      </div>

      <div className="right">
        <OranisationPanel />
      </div>

    </Container>
  );
};
