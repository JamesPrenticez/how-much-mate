import styled from '@emotion/styled';
import clsx from 'clsx';

const ToggleContainer = styled.div`
  display: flex;
  background-color: var(--color-background-strong);

  border-radius: 0.25rem;
  overflow: hidden;
  border: var(--color-border) 0.1rem solid;
`;

const ToggleButton = styled.button`
  width: 100%;
  height: 3rem;
  padding: 0.25rem 0.5rem;
  
  font-size: 1.5rem;
  line-height: 100%;
  font-family: 'Aronui';
  font-weight: 500;

  text-align: center;
  text-transform: uppercase;

  color: var(--color-disabled);

  background-color: var(--color-background-strong);

  transition: all 0.2s ease;
  cursor: pointer;

  &.active {
    color: var(--color-text-on-primary);
    background-color: var(--color-primary);
  }

  &:hover {
    /* background-color: var(--background-colorp); */
  }

  &:not(:last-of-type) {
    border-right: var(--color-border) 0.1rem solid;
  }
`;

interface ToggleButtonGroupProps<T extends string> {
  options: T[];
  active: T;
  onChange: (selected: T) => void;
}

export const ToggleButtonGroup = <T extends string>({
  options,
  active,
  onChange,
}: ToggleButtonGroupProps<T>) => {
  return (
    <ToggleContainer>
      {options.map((option) => (
        <ToggleButton
          key={option}
          className={clsx({ active: option === active })}
          onClick={() => onChange(option)}
        >
          {option}
        </ToggleButton>
      ))}
    </ToggleContainer>
  );
};
