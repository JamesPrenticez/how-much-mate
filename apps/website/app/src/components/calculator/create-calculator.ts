import { useCalculatorStore } from './calculator.store';
import { CalculatorType } from './calculator.type';
import type { Quantity } from './calculator.type';

export const createCalculator = {
  cube: ({
    name,
    width,
    height,
    depth,
  }: {
    name: string;
    width: Quantity;
    height: Quantity;
    depth: Quantity;
  }) => {
    useCalculatorStore.getState().createCalculator({
      type: CalculatorType.CUBE,
      name,
      inputs: {
        width: { dim: 1000, unit: 'mm' },
        height: { dim: 1000, unit: 'mm' },
        depth: { dim: 1000, unit: 'mm' },
      },
    });
  },
};
