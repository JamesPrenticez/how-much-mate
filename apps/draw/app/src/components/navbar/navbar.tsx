import styled from '@emotion/styled';
import { device } from '@shared/hooks';
import { NavLogo } from './navbar-logo';
import { Account } from './account-menu/account';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0rem 2rem 0rem 0rem;
  height: 6rem;
  gap: 0.5rem;
  background-color: var(--color-background-strong);

  .right {
    margin-left: auto;
  }

  @media ${device.tablet} {
    padding: 0rem 1rem;
    height: 5rem;
  }
`;

export const Navbar = () => {
  return (
    <Container>
      <NavLogo />

      <div className="right">
        <Account />
      </div>

      

    </Container>
  );
};
