import styled from '@emotion/styled';
import { Title } from '@shared/components';
import { ThemeSwitcher } from '@shared/theme';
import { SystemSwitcher } from '../system-switcher';
import clsx from 'clsx';
import { forwardRef } from 'react';

const Container = styled.div`
  position: fixed;
  inset: 5rem 0 0 0;

  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;

  background-color: var(--color-background-weak);

  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0ms ease-in-out, visibility 0ms ease-in-out;

  z-index: 100;

  &.isOpen {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transition-delay: 0s, 0s;
  }

  &:not(.isOpen) {
    transition-delay: 0s, 0ms;
  }

  .menu-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 0.5rem;
    width: 100%;
    padding: 1rem;

    .title {
      font-size: 2rem;
      color: var(--color-disabled);
    }
  }

  .settings-container {
    gap: 0.5rem;
  }
`;

interface MobileMenuModalProps extends HTMLDivElement {
  isMenuOpen: boolean;
}

export const MobileMenuModal = forwardRef<HTMLDivElement, MobileMenuModalProps>(
  ({ isMenuOpen }, ref) => {
    return (
      <Container
        ref={ref}
        className={clsx({
          isOpen: isMenuOpen,
        })}
      >
        <Title>Menu</Title>
        <div className="menu-container">
          <div className="title">General</div>
        </div>

        <div className="settings-container">
          <Title>Settings</Title>
          <ThemeSwitcher />
          <SystemSwitcher />
        </div>
      </Container>
    );
  }
);

MobileMenuModal.displayName = 'MobileMenuModal';
