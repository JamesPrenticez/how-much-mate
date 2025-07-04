import { useState } from 'react';
import { type CalculatorData, type Quantity } from './calculator.type';

export const useCalculator = <T extends CalculatorData>(initialState: T) => {
  const [calculator, setCalculator] = useState<T>(initialState);




  return {

  };
};
