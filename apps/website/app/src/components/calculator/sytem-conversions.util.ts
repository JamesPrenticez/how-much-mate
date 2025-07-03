// unitConversion.ts
import { System, Quantity, CalculatorData, CalculatorType } from './calculator.type';

export const convertQuantity = (quantity: Quantity, targetSystem: System): Quantity => {
  if (targetSystem === 'metric') {
    switch (quantity.unit) {
      case 'ft': return { value: quantity.value * 0.3048, unit: 'm' };
      case 'in': return { value: quantity.value * 25.4, unit: 'mm' };
      default: return quantity;
    }
  } else {
    switch (quantity.unit) {
      case 'm': return { value: quantity.value / 0.3048, unit: 'ft' };
      case 'mm': return { value: quantity.value / 25.4, unit: 'in' };
      default: return quantity;
    }
  }
};

export const convertCalculatorInputs = (
  calculator: CalculatorData,
  targetSystem: System
): CalculatorData => {
  switch (calculator.type) {
    case CalculatorType.CUBE: {
      return {
        ...calculator,
        inputs: {
          width: convertQuantity(calculator.inputs.width, targetSystem),
          height: convertQuantity(calculator.inputs.height, targetSystem),
          depth: convertQuantity(calculator.inputs.depth, targetSystem),
        }
      };
    }
    case CalculatorType.SQUARE: {
      return {
        ...calculator,
        inputs: {
          width: convertQuantity(calculator.inputs.width, targetSystem),
          height: convertQuantity(calculator.inputs.height, targetSystem),
        }
      };
    }
    case CalculatorType.LINEAR: {
      return {
        ...calculator,
        inputs: calculator.inputs.map(qty => convertQuantity(qty, targetSystem))
      };
    }
    default:
      return calculator;
  }
};
