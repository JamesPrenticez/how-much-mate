import styled from '@emotion/styled';
import { Button, ButtonVariants, ICONS } from '@shared/components';
import { MobileMenuModal } from './xxx.mobile-menu-modal';
import { useAppLayoutStore } from '@shared/stores';
import clsx from 'clsx';

const Container = styled.div`
  background-color: var(--color-background-medium);
  width: 100%;
`;

const HamburgerButton = styled(Button)`
  && {
    border-radius: 0.5rem;
    border: 0.1rem transparent solid;
    box-sizing: border-box;

    &.active {
      color: var(--color-primary);
      border: 0.1rem var(--color-primary) solid;
    }
  }
`;

export const MobileMenu = () => {
  const isMobileMenuOpen = useAppLayoutStore((s) => s.isOpenMobileMenu);
  const toggleMobileMenu = useAppLayoutStore((s) => s.toggleMobileMenu);

  return (
    <Container>
      <HamburgerButton
        variant={ButtonVariants.SKELETON}
        className={clsx({ active: isMobileMenuOpen })}
        onClick={toggleMobileMenu}
      >
        {ICONS.Hamburger}
      </HamburgerButton>

      <MobileMenuModal />
    </Container>
  );
};
