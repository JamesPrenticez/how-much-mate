import styled from '@emotion/styled';
import { Input, InputVariants } from '@shared/components';
import { useMeasurementStore, UnitSystems } from '@shared/stores'; // Adjust import path as needed

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 0.875rem;
  color: #374151;
`;

const UnitToggleContainer = styled.div`
  display: flex;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
  overflow: hidden;
`;

const UnitToggleButton = styled.button<{ active: boolean }>`
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
  
  &:first-of-type {
    border-right: 1px solid #d1d5db;
  }
  
  &:not(:first-of-type):not(:last-of-type) {
    border-right: 1px solid #d1d5db;
  }
`;

const InputContainer = styled.div`
  position: relative;
`;

type MetricUnit = 'mm' | 'cm' | 'm';
type ImperialUnit = 'in' | 'ft';

interface InputWithLabelProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  error?: string;
}

export const InputWithLabel = ({ 
  label, 
  value, 
  onChange, 
  placeholder,
  error 
}: InputWithLabelProps) => {
  // const { 
  //   getCurrentUnit,
  //   getAvailableUnits,
  //   changeUnit
  // } = useMeasurementStore();

  const currentUnit = getCurrentUnit();
  const availableUnits = getAvailableUnits();

  const handleUnitChange = (newUnit: MetricUnit | ImperialUnit) => {
    const result = changeUnit(newUnit, value);
    onChange(result.newValue);
  };

  const renderUnitToggle = () => {
    return (
      <UnitToggleContainer>
        {availableUnits.map((unit: any) => (
          <UnitToggleButton
            key={unit}
            active={currentUnit === unit}
            onClick={() => handleUnitChange(unit)}
          >
            {unit}
          </UnitToggleButton>
        ))}
      </UnitToggleContainer>
    );
  };

  return (
    <InputWrapper>
      <LabelContainer>
        <Label>{label}</Label>
        {renderUnitToggle()}
      </LabelContainer>
      <InputContainer>
        <Input
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          variant={InputVariants.FORM}
          type="number"
          placeholder={placeholder}
        />
      </InputContainer>
    </InputWrapper>
  );
};