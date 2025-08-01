import styled from '@emotion/styled';
import { Avatar } from './avatar';
import { MenuModal } from './menu-modal';
import { useRef, useState } from 'react';
import { useClickAway } from '@shared/hooks';

const Container = styled.div`
  background-color: rgba(var(--color-secondary-opacity), 0.6);
  padding: 1rem 1.5rem;
  border-radius: 8rem;
  cursor: pointer;
`;

export const Account = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Container
        data-ignore-click-away
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <Avatar />
      </Container>
      <MenuModal isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </>
  );
};
