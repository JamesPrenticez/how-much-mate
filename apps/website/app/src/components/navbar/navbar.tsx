import styled from '@emotion/styled';
import TowlSVG from '../../assets/icons/calc.svg?react';
import { Title } from '@shared/components';
import { NavLink } from 'react-router-dom';
import { Path } from '../../models/paths';
import { UnitSystemChanger } from './unit-system-changer';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0rem 2rem;
  height: 6rem;
  gap: 0.5rem;
  background-color: var(--color-background-strong);
`;

const LogoNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  height: 100%;
  gap: 1rem;

  :hover {
    display: flex;
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    svg {
      /* margin-top: -6rem; */
      width: 4.2rem;
      height: 4.2rem;
    }
  }

  .primary {
    color: var(--color-primary);
  }
`;

export const Navbar = () => {
  return (
    <Container>
      <LogoNavLink to={Path.HOME}>
        <div className="logo">
          <TowlSVG />
        </div>
        <Title>
          HowMuchMate<span className="primary">.</span>
        </Title>
      </LogoNavLink>

      <div>
        <UnitSystemChanger />
      </div>
    </Container>
  );
};
