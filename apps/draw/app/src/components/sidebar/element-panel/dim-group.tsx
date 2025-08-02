import { Group } from '@draw/models';
import { useControlsDrawingStore } from '@draw/stores';
import styled from '@emotion/styled';
import { Button, ButtonVariants, ICONS } from '@shared/components';
import clsx from 'clsx';
import { PropsWithChildren, useState } from 'react';

const Container = styled.div`
  padding: 0 0.5rem;
`;

const GroupTitle = styled.div`
  display: flex;
  align-items: center;
  padding: 0;
  transition: transform color ease-in-out 100ms;

  && button {
    font-size: 1.6rem;
    line-height: 2.4rem;
    color: var(--color-text-subtle);
    text-transform: capitalize;
    font-family: 'Aronui';
  }

  &.active {
    && button {
      color: var(--color-accent);
    }
  }
`;

const TitleButton = styled(Button)`
  && {
    justify-content: flex-start;
    text-align: left;
    flex-grow: 1;
  }
`;

const ChevronButton = styled(Button)`
  && {
    height: 100%;
    border-radius: 0.2rem;

    :hover {
      color: var(--color-accent);
    }

    svg {
      stroke-width: 0.2rem;
      width: 1.8rem;
      height: 1.8rem;
      transform: rotate(90deg);
    }

    &.active {
      color: var(--color-accent);
    }

    &.isOpen {
      svg {
        transform: rotate(0deg);
      }
    }
  }
`;

const GroupContent = styled.div`
  color: var(--color-text);
  background: var(--color-background-strong);
`;

interface GroupProps extends PropsWithChildren {
  title: Group;
}

export const DimGroup = ({ title, children }: GroupProps) => {
  const { activeDimensionGroup, setActiveDimentionGroup } =
    useControlsDrawingStore();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Container>
      <GroupTitle
        className={clsx({
          active: activeDimensionGroup === title,
        })}
      >
        <TitleButton
          variant={ButtonVariants.SKELETON}
          onClick={() => {
            setActiveDimentionGroup(title);
          }}
        >
          {title}
        </TitleButton>

        <ChevronButton
          variant={ButtonVariants.SKELETON}
          className={clsx({
            isOpen,
          })}
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
        >
          {ICONS.Chevron}
        </ChevronButton>
      </GroupTitle>

      {isOpen && <GroupContent>{children}</GroupContent>}
    </Container>
  );
};
