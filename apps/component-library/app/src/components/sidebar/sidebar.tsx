import styled from '@emotion/styled';
import { COMPONENT_DATA } from '../../data/components.data';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Path } from '../../models/paths';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 1.6rem 2.5rem;
  gap: 1rem;
  width: 30rem;
  max-width: 30rem;

  background-color: var(--color-black-80);

  user-select: none;

  .title {
    color: var(--color-grey-20);
    font-size: 2rem;
  }

  .nav-item {
    font-size: 2rem;
    color: var(--color-grey-40);
    padding: 0.5rem 1.5rem;
    border-radius: 0.75rem;
    transition: color ease-in-out 200ms;
    cursor: pointer;

    :hover,
    :focus-visible {
      background-color: var(--color-black-20);
    }

    &.active {
      color: var(--color-primary);
    }
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
