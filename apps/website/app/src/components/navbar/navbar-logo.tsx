import styled from '@emotion/styled';
import { device } from '@shared/hooks';

import TowlSVG from '../../assets/icons/calc.svg?react';
import { Title } from '@shared/components';
import { NavLink } from 'react-router-dom';
import { Path } from '../../models/paths';

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
      width: 4.2rem;
      height: 4.2rem;
    }
  }

  .primary {
    color: var(--color-primary);
  }

  @media ${device.tablet} {
    gap: 0.5rem;
    .logo {
      svg {
        width: 2.8rem;
        height: 2.8rem;
      }
    }
  }
`;

export const NavLogo = () => {
  return (
    <LogoNavLink to={Path.HOME}>
      <div className="logo">
        <TowlSVG />
      </div>
      <Title>
        HowMuchMate<span className="primary">.</span>
      </Title>
    </LogoNavLink>
  );
};
