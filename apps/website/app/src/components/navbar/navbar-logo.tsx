import styled from '@emotion/styled';
import { device } from '@shared/hooks';

// import LogoSVG from '../../assets/icons/hard-hat.svg?react';
import { Title } from '@shared/components';
import { NavLink } from 'react-router-dom';
import { Path } from '../../models/paths';
import { ICONS } from '@shared/components';

const LogoNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  height: 100%;
  gap: 1rem;
  margin-right: auto;

  :hover {
    display: flex;
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    svg {
      transform: scaleX(-1);
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
        {ICONS.Trowl}
      </div>
      <Title>
        HowMuchMate<span className="primary">.</span>
      </Title>
    </LogoNavLink>
  );
};
