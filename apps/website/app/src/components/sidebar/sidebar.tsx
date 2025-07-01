import styled from '@emotion/styled';
import { COMPONENT_DATA } from '../../data/components.data';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Path } from '../../models/paths';
import { device } from "@shared/hooks"

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

  .nav-item {
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
  }

  @media ${device.tablet} {
    display: none;
  }
`;

export const Sidebar = () => {
  return (
    <Container>
      <div className="title">Components</div>

      {[...COMPONENT_DATA]
        .filter((item) => item.path !== Path.HOME)
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              clsx('nav-item', {
                active: isActive,
              })
            }
          >
            {item.title}
          </NavLink>
        ))}
    </Container>
  );
};
