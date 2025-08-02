import styled from '@emotion/styled';
import { Button, ButtonVariants } from '@shared/components';
import { useState } from 'react';
import { Subgroup } from './subgroup';
import { ElementGroupTree } from '@draw/models';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--color-background-strong);
`;

const ElementGroupHeaderButton = styled(Button)`
  && {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0rem 0.5rem;
    transition: transform color ease-in-out 100ms;

    color: var(--color-action-hover);
    font-size: 1.4rem;
    line-height: 2.4rem;
    font-weight: 500;
    text-transform: capitalize;

    background-color: var(--color-background-medium);

    &.active {
      && button {
        color: var(--color-accent);
      }
    }
  }
`;

interface ElementGroupProps {
  element: ElementGroupTree;
}

export const ElementGroup = ({ element }: ElementGroupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Container>
      <ElementGroupHeaderButton 
        variant={ButtonVariants.SKELETON}
        onClick={() => setIsOpen(prev => !prev)}
      >
        {element.name}
      </ElementGroupHeaderButton>

      {isOpen &&
        element.elementSubGroups.map((subgroup) => (
          <Subgroup key={subgroup.name} subgroup={subgroup} />
        ))
      }
    </Container>
  );
};
