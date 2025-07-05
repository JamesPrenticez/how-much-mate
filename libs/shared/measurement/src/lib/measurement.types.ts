export enum MeasurementType {
    CUBE = 'cube',
    SQUARE = 'square',
    LINEAR = 'linear',
}

export type MetricUnit = 'mm' | 'cm' | 'm';
export type ImperialUnit = 'in' | 'ft' | 'yd';

export type Quantity = {
  value: number;
  unit: MetricUnit | ImperialUnit;
}

interface BaseMeasurementType {
    name: string;
}

interface Cube extends BaseMeasurementType {
    type: MeasurementType.CUBE;
    inputs: {
      width: Quantity;
      length: Quantity;
      depth: Quantity;
    }
}

interface Square extends BaseMeasurementType {
    type: MeasurementType.SQUARE;
    inputs: {
      width: Quantity;
      length: Quantity;
    }
}

interface Linear extends BaseMeasurementType {
    type: MeasurementType.LINEAR;
    inputs: Quantity[];
}

export type MeasurementData = Cube | Square | Linear;