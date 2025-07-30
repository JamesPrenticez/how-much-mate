import styled from '@emotion/styled';

import { SystemSwitcher } from './system-switcher';
import { MobileMenu } from './mobile-menu';
import { device } from '@shared/hooks';
import { NavLogo } from './navbar-logo';
import { ThemeSwitcher } from '@shared/theme';
import { Nav_Items } from '../../data/navigation.data';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Button, ButtonVariants } from '@shared/components';
import { adminService } from '@draw/db';

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

const NavItem = styled(NavLink)`
  font-size: 2rem;
  color: var(--color-text-subtle);
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  transition: color ease-in 200ms;
  cursor: pointer;

  /* :hover,
    :focus-visible {
      background-color: var(--color-primary);
    } */

  &.active {
    color: var(--color-secondary);
    background-color: var(--color-primary);
  }
`;

const DatabaseButton = styled(Button)`
  && {
    font-size: 2rem;
    line-height: 3.08rem; // dumb shit

    padding: 0.5rem 1.5rem;
    border-radius: 0.5rem;
    transition: color ease-in 200ms;
    cursor: pointer;

    &.seed {
      margin-left: auto;
      color: darkgreen;
      background-color: var(--color-rag-green);
    }

    &.delete {
      color: darkred;
      background-color: var(--color-rag-red);
    }
  }
`;

export const Navbar = () => {
  return (
    <Container>
      <NavLogo />

      {Nav_Items.map((item) => (
        <NavItem
          key={item.id}
          to={item.path}
          className={({ isActive }) => clsx({ active: isActive })}
        >
          {item.title}
        </NavItem>
      ))}


      <DatabaseButton
        className="seed"
        variant={ButtonVariants.SKELETON}
        onClick={() => {
          adminService.reSeed();
          window.location.reload();
        }}
      >
        Seed DB
      </DatabaseButton>
      <DatabaseButton
        className="delete"
        variant={ButtonVariants.SKELETON}
        onClick={() => {
          adminService.clearDatabase();
          window.location.reload();
        }}
      >
        Delete DB
      </DatabaseButton>
      <div className="switches">
        <SystemSwitcher />
        <ThemeSwitcher />
      </div>

      <div className="mobile-only">
        <MobileMenu />
      </div>
    </Container>
  );
};
