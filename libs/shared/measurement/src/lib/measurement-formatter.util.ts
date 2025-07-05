import { formatImperialFraction, formatImperialDecimal } from "./convert-imperial";
import { toMetric } from "./convert-metric";

export type MetricUnit = 'mm' | 'cm' | 'm';
export type ImperialUnit = 'in' | 'ft' | 'yd';

export enum System {
  METRIC = 'metric',
  IMPERIAL = 'imperial'
}

export const formatNumber = (num: number): string => {
  return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export const formatMeasurement = (mm: number, desiredUnit: MetricUnit | ImperialUnit, isFraction?: boolean): string => {
  switch (desiredUnit) {
    case 'mm':
    case 'cm':
    case 'm':
      return toMetric(mm, desiredUnit);
    case 'in':
    case 'ft':
    case 'yd': {
      return isFraction ? formatImperialFraction(mm, desiredUnit) : formatImperialDecimal(mm, desiredUnit);
    }
    default:
      throw new Error('Unsupported unit');
  }
}

// export function parseMeasurement(input: string, system: System, unit: MetricUnit | ImperialUnit): number {
//   const numberPart = parseFloat(input.replace(/[^\d.-]/g, '')); // crude but works
//   if (isNaN(numberPart)) return NaN;

//   if (system === System.METRIC) {
//     switch (unit) {
//       case 'cm': return numberPart * 10;
//       case 'm':  return numberPart * 1000;
//       default:   return numberPart;
//     }
//   } else {
//     switch (unit) {
//       case 'ft': return numberPart * 304.8;   // 1 ft = 304.8 mm
//       case 'in': return numberPart * 25.4;    // 1 in = 25.4 mm
//       default:   return numberPart;
//     }
//   }
// }