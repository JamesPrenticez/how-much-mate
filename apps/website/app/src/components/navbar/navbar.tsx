import styled from '@emotion/styled';

import { SystemChanger } from './system-changer';
import { MobileMenu } from './mobile-menu';
import { device } from '@shared/hooks';
import { NavLogo } from './navbar-logo';
import { ThemeSwitcher } from '@shared/theme';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0rem 2rem;
  height: 6rem;
  gap: 0.5rem;
  background-color: var(--color-background-strong);

  @media ${device.tablet} {
    padding: 0rem 1rem;
    height: 5rem;

    .system-changer {
      display: none;
    }
  }
`;

export const Navbar = () => {
  return (
    <Container>
      <NavLogo />
      <div className='system-changer'>
        <SystemChanger />
      </div>
      <ThemeSwitcher />
      <MobileMenu />
    </Container>
  );
};
