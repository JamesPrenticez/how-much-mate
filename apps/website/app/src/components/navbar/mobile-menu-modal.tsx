import styled from '@emotion/styled';
import { Title } from '@shared/components';
import { ThemeSwitcher } from '@shared/theme';
import { SystemSwitcher } from './system-switcher';
import { useAppLayoutStore } from '@shared/stores';
import clsx from 'clsx';

const Container = styled.div`
  display: none;
  position: fixed;
  inset: 5rem 0 0 0;
  padding: 1rem;

  background-color: var(--color-background-weak);

  z-index: 100;

  .row {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-left: auto;
  }

  &.isOpen {
    display: block;
  }
`;

export const MobileMenuModal = () => {
  const isOpenMobileMenu = useAppLayoutStore(s => s.isOpenMobileMenu)

  return (
    <Container className={clsx({
      isOpen: isOpenMobileMenu
    })}>
      <div className='row'>
        <Title>Menu</Title>
      </div>

      <div className='row'>
        <Title>Settings</Title>
        <ThemeSwitcher />
        <SystemSwitcher />
      </div>
    </Container>
  );
};
