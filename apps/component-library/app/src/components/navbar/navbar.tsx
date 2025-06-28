import styled from '@emotion/styled';
import LogoSVG from '../../assets/logo.svg?react';
import { Title } from '@shared/components';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0rem 2rem;
  gap: 1rem;
  height: 6rem;
  background-color: var(--color-black-80);

  .logo {
    svg {
      width: 4rem;
      height: 4rem;
    }
  }
`;

export const Navbar = () => {
  return (
    <Container>
      <div className="logo">
        <LogoSVG />
      </div>

      <Title>Component Library</Title>
    </Container>
  );
};
