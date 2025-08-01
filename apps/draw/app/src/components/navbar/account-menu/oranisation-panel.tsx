import styled from '@emotion/styled';
import { MenuModal } from './menu-modal';
import { useState } from 'react';
import { Button, ButtonVariants } from '@shared/components';
import { OrgAvatar } from './org-avatar';

const OranisationPanelButton = styled(Button)`
&& {
  border: transparent 0.1rem solid;
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  border-radius: 2rem;
  cursor: pointer;

  transition: border-color 100ms ease-in-out;

  &:hover {
    border-color: rgba(var(--color-action-hover-opacity), 0.7);
  }
}
`;



export const OranisationPanel = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <OranisationPanelButton
        variant={ButtonVariants.SKELETON}
        data-ignore-click-away
        onClick={() => setIsMenuOpen((prev) => !prev)}
        tabIndex={0}
      >
        <OrgAvatar />
      </OranisationPanelButton>
      <MenuModal isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </>
  );
};
