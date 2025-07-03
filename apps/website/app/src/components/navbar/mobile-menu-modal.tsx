import styled from '@emotion/styled';
import { Title } from '@shared/components';
import { ThemeSwitcher } from '@shared/theme';
import { SystemSwitcher } from './system-switcher';
import { useAppLayoutStore } from '@shared/stores';
import clsx from 'clsx';
import {
  Calculator_Nav_Items,
  General_Nav_Items,
} from '../../data/navigation.data';
import { Path } from '../../models/paths';
import { NavLink } from 'react-router-dom';

const Container = styled.div`
  position: fixed;
  inset: 5rem 0 0 0;

  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;

  background-color: var(--color-background-weak);

  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0ms ease-in-out, visibility 0ms ease-in-out;

  z-index: 100;

  &.isOpen {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transition-delay: 0s, 0s;
  }

  &:not(.isOpen) {
    transition-delay: 0s, 0ms;
  }

  .menu-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 0.5rem;
    width: 100%;
    padding: 1rem;

    .title {
      font-size: 2rem;
      color: var(--color-disabled);
    }
  }

  .settings-container {
    gap: 0.5rem;
  }
`;
const NavItem = styled(NavLink)`
  width: 100%;
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

export const MobileMenuModal = () => {
  const isOpenMobileMenu = useAppLayoutStore((s) => s.isOpenMobileMenu);
  const setIsOpenMobileMenu = useAppLayoutStore(s => s.setIsOpenMobileMenu)

  return (
    <Container
      className={clsx({
        isOpen: isOpenMobileMenu,
      })}
    >
      <Title>Menu</Title>
      <div className="menu-container">
        <div className="title">General</div>
        {[...General_Nav_Items]
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((item) => (
            <NavItem
              key={item.id}
              to={item.path}
              onClick={() => setIsOpenMobileMenu(false)}
              className={({ isActive }) => clsx({ active: isActive })}
            >
              {item.title}
            </NavItem>
          ))}

        <div className="title">Calculators</div>

        {[...Calculator_Nav_Items]
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((item) => (
            <NavItem
              key={item.id}
              to={item.path}
              onClick={() => setIsOpenMobileMenu(false)}
              className={({ isActive }) => clsx({ active: isActive })}
            >
              {item.title}
            </NavItem>
          ))}
      </div>

      <div className="settings-container">
        <Title>Settings</Title>
        <ThemeSwitcher />
        <SystemSwitcher />
      </div>
    </Container>
  );
};
