import styled from '@emotion/styled';
import { Nav_Items } from '../../data/navigation.data';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const Container = styled.div`
  height: 4rem;
  display: flex;
  background-color: rgba(var(--color-secondary-opacity), 0.5);
  /* padding: 0.5rem 0.5rem 0 0.5rem; */
`
const NavItem = styled(NavLink)`
  font-size: 2rem;
  color: var(--color-text-subtle);
  padding: 0.5rem 1.5rem;
  transition: color ease-in 200ms;
  cursor: pointer;

  &.active {
    color: var(--color-secondary);
    background-color: var(--color-primary);
  }
`;

export const SubNavbar = () => {
  return (
    <Container>
      {Nav_Items.map((item) => (
        <NavItem
          key={item.id}
          to={item.path}
          className={({ isActive }) => clsx({ active: isActive })}
        >
          {item.title}
        </NavItem>
      ))}
    </Container>
  )
}