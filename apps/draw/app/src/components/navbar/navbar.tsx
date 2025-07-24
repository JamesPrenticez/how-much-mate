import styled from '@emotion/styled';

import { SystemSwitcher } from './system-switcher';
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

  .switches {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.2rem;
    width: 19rem;
    height: 5rem;

    & button {
      height: 2rem;
    }
  }

  .mobile-only {
    display: none;
  }

  @media ${device.tablet} {
    padding: 0rem 1rem;
    height: 5rem;

    .mobile-only {
      display: block;
    }

    .switches {
      display: none;
    }
  }
`;

export const Navbar = () => {
  return (
    <Container>
      <NavLogo />

      <div className='switches'>
        <SystemSwitcher />
        <ThemeSwitcher />
      </div>

      <div className='mobile-only'>
        <MobileMenu />
      </div>
    </Container>
  );
};
