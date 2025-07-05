export type MetricUnit = 'mm' | 'cm' | 'm';
export type ImperialUnit = 'in' | 'ft';

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

function toImperial(mm: number, desiredUnit: ImperialUnit): string {
  const isNegative = mm < 0;
  const inches = Math.abs(mm) / 25.4;
  
  if (desiredUnit === 'in') {
    const whole = Math.floor(inches);
    const fraction = inches - whole;
    const nearest = FRACTIONS.reduce((prev, curr) =>
      Math.abs(curr.decimal - fraction) < Math.abs(prev.decimal - fraction) ? curr : prev
    );
    const result = whole > 0 
      ? `${formatNumber(whole)}${nearest.unicode} in`
      : `${nearest.unicode || '0'} in`;
    return isNegative ? `-${result}` : result;
  }

  if (desiredUnit === 'ft') {
    const totalFeet = inches / 12;
    const result = `${formatNumber(totalFeet)} ft`;
    return isNegative ? `-${result}` : result;
  }

  return `${formatNumber(inches)} in`;
}

function toMetric(mm: number, desiredUnit: MetricUnit): string {
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

export function formatMeasurement(
  mm: number,
  system: System,
  desiredUnit: MetricUnit | ImperialUnit
): string {
  if (system === System.METRIC && (desiredUnit === 'mm' || desiredUnit === 'cm' || desiredUnit === 'm')) {
    return toMetric(mm, desiredUnit);
  }

  if (system === System.IMPERIAL && (desiredUnit === 'in' || desiredUnit === 'ft')) {
    return toImperial(mm, desiredUnit);
  }

  throw new Error('Invalid unit for the selected system');
}
