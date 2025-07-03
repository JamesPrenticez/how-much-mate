import styled from '@emotion/styled';


const ToggleContainer = styled.div`
  display: flex;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
  overflow: hidden;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  background-color: ${props => props.active ? '#3b82f6' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#6b7280'};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.active ? '#2563eb' : '#e5e7eb'};
  }

  &:not(:last-of-type) {
    border-right: 1px solid #d1d5db;
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
      {options.map(option => (
        <ToggleButton
          key={option}
          active={active === option}
          onClick={() => onChange(option)}
        >
          {option}
        </ToggleButton>
      ))}
    </ToggleContainer>
  );
};
