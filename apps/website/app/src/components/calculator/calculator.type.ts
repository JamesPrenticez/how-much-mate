export enum CalculatorType {
    CUBE = 'cube',
    SQUARE = 'square',
    LINEAR = 'linear',
}

export type MetricUnit = 'mm' | 'cm' | 'm';
export type ImperialUnit = 'in' | 'ft';

export type Quantity = {
  dim: number;
  unit: MetricUnit | ImperialUnit;
}

interface BaseCalculatorData {
    name: string;
}

interface CubeCalculatorData extends BaseCalculatorData {
    type: CalculatorType.CUBE;
    inputs: {
      width: Quantity;
      height: Quantity;
      depth: Quantity;
    }
}

interface SquareCalculatorData extends BaseCalculatorData {
    type: CalculatorType.SQUARE;
    inputs: {
      width: Quantity;
      height: Quantity;
    }
}

interface LinearCalculatorData extends BaseCalculatorData {
    type: CalculatorType.LINEAR;
    inputs: Quantity[];
}

export type CalculatorData = CubeCalculatorData | SquareCalculatorData | LinearCalculatorData;
