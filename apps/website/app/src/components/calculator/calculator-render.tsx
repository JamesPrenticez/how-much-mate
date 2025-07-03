import React from 'react';
import { useCalculatorStore } from './calculator.store';

export const CaclculatorRenderer = () => {
  const calculator = useCalculatorStore((s) => s.calculator);

  if (!calculator) return null;

  return (
    <div>
      <div>
        <h2>{calculator.name} Calculator</h2>
        {Object.entries(calculator.inputs).map(([key, input], idx) => (
          <div key={idx}>
            <label>{key}</label>
            <div>
              {input.dim} {input.unit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
