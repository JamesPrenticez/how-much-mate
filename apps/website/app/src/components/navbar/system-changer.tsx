import React from 'react';
import { useCalculatorStore } from '../calculator/calculator.store';
import { Select } from '@shared/components';
import { System, SystemType } from "../calculator/calculator.type"

export const SystemChanger = () => {
  const { system, setSystem } = useCalculatorStore();

  const handleChange = (value: string) => {
    setSystem(value as SystemType);
  };

  const options = Object.values(System).map((value) => ({
    label: value,
    value,
  }));

  return (
    <div style={{ width: 110 }}>
      <Select
        value={system}
        options={options}
        onChange={handleChange}
        placeholder="Select a measurement standard"
      />
    </div>
  );
};
