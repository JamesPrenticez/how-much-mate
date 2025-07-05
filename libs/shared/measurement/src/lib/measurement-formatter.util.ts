export type MetricUnit = 'mm' | 'cm' | 'm';
export type ImperialUnit = 'in' | 'ft' | 'yd';

export enum System {
  METRIC = 'metric',
  IMPERIAL = 'imperial'
}

const FRACTIONS = [
  { decimal: 0, unicode: '' },
  { decimal: 1 / 32, unicode: '¹⁄₃₂' },
  { decimal: 1 / 16, unicode: '¹⁄₁₆' },
  { decimal: 3 / 32, unicode: '³⁄₃₂' },
  { decimal: 1 / 8, unicode: '⅛' },
  { decimal: 5 / 32, unicode: '⁵⁄₃₂' },
  { decimal: 3 / 16, unicode: '3⁄16' },
  { decimal: 7 / 32, unicode: '7⁄32' },
  { decimal: 1 / 4, unicode: '¼' },
  { decimal: 9 / 32, unicode: '9⁄32' },
  { decimal: 5 / 16, unicode: '5⁄16' },
  { decimal: 11 / 32, unicode: '11⁄32' },
  { decimal: 3 / 8, unicode: '⅜' },
  { decimal: 13 / 32, unicode: '13⁄32' },
  { decimal: 7 / 16, unicode: '7⁄16' },
  { decimal: 15 / 32, unicode: '15⁄32' },
  { decimal: 1 / 2, unicode: '½' },
  { decimal: 17 / 32, unicode: '17⁄32' },
  { decimal: 9 / 16, unicode: '9⁄16' },
  { decimal: 19 / 32, unicode: '19⁄32' },
  { decimal: 5 / 8, unicode: '⅝' },
  { decimal: 21 / 32, unicode: '21⁄32' },
  { decimal: 11 / 16, unicode: '11⁄16' },
  { decimal: 23 / 32, unicode: '23⁄32' },
  { decimal: 3 / 4, unicode: '¾' },
  { decimal: 25 / 32, unicode: '25⁄32' },
  { decimal: 13 / 16, unicode: '13⁄16' },
  { decimal: 27 / 32, unicode: '27⁄32' },
  { decimal: 7 / 8, unicode: '⅞' },
  { decimal: 29 / 32, unicode: '29⁄32' },
  { decimal: 15 / 16, unicode: '15⁄16' },
  { decimal: 31 / 32, unicode: '31⁄32' },
];

function formatNumber(num: number): string {
  return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

// function toImperial(mm: number, desiredUnit: ImperialUnit | 'yd'): string {
//   const isNegative = mm < 0;
//   const absMm = Math.abs(mm);
//   const inches = absMm / 25.4;

//   if (desiredUnit === 'in') {
//     const whole = Math.floor(inches);
//     const fraction = inches - whole;
//     const nearest = FRACTIONS.reduce((prev, curr) =>
//       Math.abs(curr.decimal - fraction) < Math.abs(prev.decimal - fraction) ? curr : prev
//     );
//     const result = whole > 0
//       ? `${formatNumber(whole)}${nearest.unicode} in`
//       : `${nearest.unicode || '0'} in`;
//     return isNegative ? `-${result}` : result;
//   }

//   if (desiredUnit === 'ft') {
//     const totalFeet = inches / 12;
//     const result = `${formatNumber(totalFeet)} ft`;
//     return isNegative ? `-${result}` : result;
//   }

//   if (desiredUnit === 'yd') {
//     const totalYards = absMm / 914.4;
//     const result = `${formatNumber(totalYards)} yd`;
//     return isNegative ? `-${result}` : result;
//   }

//   return `${formatNumber(inches)} in`;
// }

function convertToImperialDecimal(mm: number, unit: 'in' | 'ft' | 'yd'): number {
  switch (unit) {
    case 'in': return mm / 25.4;
    case 'ft': return mm / 304.8;
    case 'yd': return mm / 914.4;
    default: throw new Error('Unsupported unit');
  }
}

// format decimal with 2 dp & thousands separator
function formatImperialDecimal(value: number, unit: 'in' | 'ft' | 'yd'): string {
  const isNegative = value < 0;
  const abs = Math.abs(value);
  const formatted = formatNumber(abs);
  return isNegative ? `-${formatted} ${unit}` : `${formatted} ${unit}`;
}

// format mixed fraction
function formatImperialFraction(value: number, unit: 'in' | 'ft' | 'yd'): string {
  const isNegative = value < 0;
  const abs = Math.abs(value);
  const whole = Math.floor(abs);
  const fraction = abs - whole;

  const nearest = FRACTIONS.reduce((prev, curr) =>
    Math.abs(curr.decimal - fraction) < Math.abs(prev.decimal - fraction) ? curr : prev
  );

  const fractionPart = nearest.unicode || '';
  const wholePart = whole > 0 ? `${formatNumber(whole)}` : '';
  const result = fractionPart ? `${wholePart}${fractionPart} ${unit}` : `${wholePart} ${unit}`;

  return isNegative ? `-${result.trim()}` : result.trim();
}

const toMetric = (mm: number, desiredUnit: MetricUnit): string => {
  switch (desiredUnit) {
    case 'mm':
      return `${formatNumber(mm)} mm`;
    case 'cm':
      return `${formatNumber(mm / 10)} cm`;
    case 'm':
      return `${formatNumber(mm / 1000)} m`;
    default:
      return `${formatNumber(mm)} mm`;
  }
}

export function formatMeasurement(mm: number, desiredUnit: MetricUnit | ImperialUnit | 'yd'): string {
  switch (desiredUnit) {
    case 'mm':
    case 'cm':
    case 'm':
      return toMetric(mm, desiredUnit);
    case 'in':
    case 'ft':
    case 'yd': {
      const decimal = convertToImperialDecimal(mm, desiredUnit);
      return formatImperialDecimal(decimal, desiredUnit);
      // or use: return formatImperialFraction(decimal, desiredUnit);
    }
    default:
      throw new Error('Unsupported unit');
  }
}

export function parseMeasurement(input: string, system: System, unit: MetricUnit | ImperialUnit): number {
  const numberPart = parseFloat(input.replace(/[^\d.-]/g, '')); // crude but works
  if (isNaN(numberPart)) return NaN;

  if (system === System.METRIC) {
    switch (unit) {
      case 'cm': return numberPart * 10;
      case 'm':  return numberPart * 1000;
      default:   return numberPart;
    }
  } else {
    switch (unit) {
      case 'ft': return numberPart * 304.8;   // 1 ft = 304.8 mm
      case 'in': return numberPart * 25.4;    // 1 in = 25.4 mm
      default:   return numberPart;
    }
  }
}