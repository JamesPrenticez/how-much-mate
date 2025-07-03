import React from 'react';
import { useCalculatorStore } from '../calculator/calculator.store';
import { ToggleButtonGroup } from '@shared/components';
import { System, SystemType } from "../calculator/calculator.type"

export const SystemSwitcher = () => {
  const { system, setSystem } = useCalculatorStore();

  const handleChange = (value: string) => {
    setSystem(value as SystemType);
  };

  const options = Object.values(System).map((value) => (value));

  return (
    <ToggleButtonGroup
      options={options}
      active={system}
      onChange={handleChange}
    />
  );
};
