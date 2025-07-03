import styled from '@emotion/styled';
import {
  Calculator_Nav_Items,
  General_Nav_Items,
} from '../../data/navigation.data';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Path } from '../../models/paths';
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

const NavItem = styled(NavLink)`
  font-size: 2rem;
  color: var(--color-text-subtle);
  padding: 0.5rem 1.5rem;
  border-radius: 0.75rem;
  transition: color ease-in-out 200ms;
  cursor: pointer;

  :hover,
  :focus-visible {
    background-color: var(--color-primary);
  }

  &.active {
    color: var(--color-secondary);
    background-color: var(--color-primary);
  }
`;

export const Sidebar = () => {
  return (
    <Container>
      <div className="title">General</div>

      {[...General_Nav_Items]
        // .filter((item) => item.path !== Path.HOME)
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((item) => (
          <NavItem
            key={item.id}
            to={item.path}
            className={({ isActive }) => clsx({ active: isActive })}
          >
            {item.title}
          </NavItem>
        ))}

      <div className="title">Calculators</div>

      {[...Calculator_Nav_Items]
        // .filter((item) => item.path !== Path.HOME)
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((item) => (
          <NavItem
            key={item.id}
            to={item.path}
            className={({ isActive }) => clsx({ active: isActive })}
          >
            {item.title}
          </NavItem>
        ))}
    </Container>
  );
};
