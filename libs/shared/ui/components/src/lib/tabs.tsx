import styled from '@emotion/styled';
import clsx from 'clsx';
import type { KeyLabel } from '@shared/models'

const TabsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const Tab = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  width: 100%;
  height: 5rem;
  cursor: pointer;

  font-family: 'Quicksand', sans-serif;
  font-size: 3rem;
  font-weight: 700;

  text-transform: uppercase;
  transition: all 500ms ease;
  
  color: var(--color-text-subtle);
  border-bottom: 0.4rem solid var(--color-grey-40);

  &.selected {
    color: var(--color-secondary);
    background-color: var(--color-primary);
    border-color: rgba(var(--color-secondary-opacity), 0.2);

  }

  &.default {
    /* add other styles if you want */
  }
`;

export enum TabsVariants {
  DEFAULT = 'default',
}

interface TabsProps {
  items: KeyLabel[];
  selectedKey: string;
  onChange: (key: string) => void;
  variant?: TabsVariants;
}

export const Tabs = ({
  items,
  selectedKey,
  onChange,
  variant = TabsVariants.DEFAULT,
}: TabsProps) => {
  return (
    <TabsContainer>
      {items.map((item) => (
        <Tab
          key={item.key}
          className={clsx(variant, {
            selected: selectedKey === item.key
          })}
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </Tab>
      ))}
    </TabsContainer>
  );
};
