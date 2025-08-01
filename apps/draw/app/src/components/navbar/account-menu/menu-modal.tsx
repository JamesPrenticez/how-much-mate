import styled from '@emotion/styled';
import { useRef } from 'react';
import { useClickAway } from '@shared/hooks';
import { Button, ButtonVariants } from '@shared/components';
import { useElementStore } from '@draw/stores';
import { adminService } from '@draw/db';
import { SystemSwitcher } from '../system-switcher';
import { ThemeSwitcher } from '@shared/theme';

const Container = styled.div`
    position: absolute;
    top: 7rem;
    right: 2rem;

    display: flex;
    flex-direction: column;
    gap: 1rem;

    width: 30rem;
    height: 30rem;
    padding: 2rem;

    transition-property: width, height;
    transition-duration: 200ms;
    
    border-top: rgba(var(--color-action-opacity), 0.5) 0.2rem solid;
    border-radius: 0.8rem;

    background: rgba(
        var(--color-background-strong-opacity),
        0.8
    );

    backdrop-filter: var(--filter-blur-primary);
    pointer-events: auto;
`;


const DatabaseButton = styled(Button)`
  && {
    width: 100%;
    font-size: 2rem;
    line-height: 3.08rem; // dumb shit

    padding: 0.5rem 1.5rem;
    border-radius: 0.5rem;
    transition: color ease-in 200ms;
    cursor: pointer;

    &.seed {
      color: darkgreen;
      background-color: var(--color-rag-green);
    }

    &.delete {
      color: darkred;
      background-color: var(--color-rag-red);
    }
  }
`;

interface MenuModalProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MenuModal = ({ isMenuOpen, setIsMenuOpen }: MenuModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { fetchCompanyTree } = useElementStore();

  useClickAway(modalRef, () => {
    setIsMenuOpen(false);
  });

  if (!isMenuOpen) return null;

  return (
    <Container
      ref={modalRef}
    >


      <DatabaseButton
        className="seed"
        variant={ButtonVariants.SKELETON}
        onClick={async () => {
          await adminService.reSeed();
          await fetchCompanyTree();
        }}
      >
        Seed DB
      </DatabaseButton>
      <DatabaseButton
        className="delete"
        variant={ButtonVariants.SKELETON}
        onClick={async () => {
          await adminService.clearDatabase();
          await fetchCompanyTree();
        }}
      >
        Delete DB
      </DatabaseButton>

            <div className="switches">
              <SystemSwitcher />
              <ThemeSwitcher />
            </div>
      

      {/* {menuItems.map((item) => (
        <NavLink key={item.key} to={item.key}>
          <Button variant={ButtonVariants.RIGHT_NAV}>
            {item.icon} {item.title.toUpperCase()}
          </Button>
        </NavLink>
      ))} */}
    </Container>
  );
};
