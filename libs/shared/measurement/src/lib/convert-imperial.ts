import { formatNumber } from "./measurement-formatter.util";

interface ImperialParts {
  whole: number;
  decimal: number;
  decimalPart: string;
  fractionPart: string;
}

const FRACTIONS = [
  { decimal: 0, unicode: '' },
  { decimal: 1 / 32, unicode: '¹⁄₃₂' },
  { decimal: 1 / 16, unicode: '¹⁄₁₆' },
  { decimal: 3 / 32, unicode: '³⁄₃₂' },
  { decimal: 1 / 8, unicode: '⅛' },
  { decimal: 5 / 32, unicode: '⁵⁄₃₂' },
  { decimal: 3 / 16, unicode: '³⁄₁₆' },
  { decimal: 7 / 32, unicode: '⁷⁄₃₂' },
  { decimal: 1 / 4, unicode: '¼' },
  { decimal: 9 / 32, unicode: '⁹⁄₃₂' },
  { decimal: 5 / 16, unicode: '⁵⁄₁₆' },
  { decimal: 11 / 32, unicode: '¹¹⁄₃₂' },
  { decimal: 3 / 8, unicode: '⅜' },
  { decimal: 13 / 32, unicode: '¹³⁄₃₂' },
  { decimal: 7 / 16, unicode: '⁷⁄₁₆' },
  { decimal: 15 / 32, unicode: '¹⁵⁄₃₂' },
  { decimal: 1 / 2, unicode: '½' },
  { decimal: 17 / 32, unicode: '¹⁷⁄₃₂' },
  { decimal: 9 / 16, unicode: '⁹⁄₁₆' },
  { decimal: 19 / 32, unicode: '¹⁹⁄₃₂' },
  { decimal: 5 / 8, unicode: '⅝' },
  { decimal: 21 / 32, unicode: '²¹⁄₃₂' },
  { decimal: 11 / 16, unicode: '¹¹⁄₁₆' },
  { decimal: 23 / 32, unicode: '²³⁄₃₂' },
  { decimal: 3 / 4, unicode: '¾' },
  { decimal: 25 / 32, unicode: '²⁵⁄₃₂' },
  { decimal: 13 / 16, unicode: '¹³⁄₁₆' },
  { decimal: 27 / 32, unicode: '²⁷⁄₃₂' },
  { decimal: 7 / 8, unicode: '⅞' },
  { decimal: 29 / 32, unicode: '²⁹⁄₃₂' },
  { decimal: 15 / 16, unicode: '¹⁵⁄₁₆' },
  { decimal: 31 / 32, unicode: '³¹⁄₃₂' },
];

export function convertToImperialDecimal(mm: number, unit: 'in' | 'ft' | 'yd'): number {
  switch (unit) {
    case 'in': return mm / 25.4;
    case 'ft': return mm / 304.8;
    case 'yd': return mm / 914.4;
    default: throw new Error('Unsupported unit');
  }
}

export function formatImperialDecimal(mm: number, unit: 'in' | 'ft' | 'yd'): string {
  const value = convertToImperialDecimal(mm, unit);
  const formatted = value.toFixed(4);
  return `${formatted} ${unit}`;
}

export function formatImperialFraction(mm: number, unit: 'in' | 'ft' | 'yd'): string {
  let totalInches = convertToImperialDecimal(mm, 'in');

  if (unit === 'in') {
    const whole = Math.floor(totalInches);
    const fractionDecimal = totalInches - whole;

    const nearest = FRACTIONS.reduce((a, b) =>
      Math.abs(b.decimal - fractionDecimal) < Math.abs(a.decimal - fractionDecimal) ? b : a
    );

    // Handle fraction rounding up to 1
    let finalWhole = whole;
    let finalFraction = nearest;
    if (nearest.decimal >= 0.999) {
      finalWhole += 1;
      finalFraction = FRACTIONS[0];
    }

    return finalFraction.unicode
      ? `${finalWhole} inches and ${finalFraction.unicode}`
      : `${finalWhole} inches`;
  }

  if (unit === 'ft') {
    const feet = Math.floor(totalInches / 12);
    totalInches -= feet * 12;

    const inchesWhole = Math.floor(totalInches);
    const fractionDecimal = totalInches - inchesWhole;

    const nearest = FRACTIONS.reduce((a, b) =>
      Math.abs(b.decimal - fractionDecimal) < Math.abs(a.decimal - fractionDecimal) ? b : a
    );

    let finalInchesWhole = inchesWhole;
    let finalFraction = nearest;

    if (nearest.decimal >= 0.999) {
      finalInchesWhole += 1;
      finalFraction = FRACTIONS[0];
    }

    // Carry over if inches hit 12
    let finalFeet = feet;
    if (finalInchesWhole === 12) {
      finalFeet += 1;
      finalInchesWhole = 0;
    }

    return finalFraction.unicode
      ? `${finalFeet} feet ${finalInchesWhole} inches and ${finalFraction.unicode}`
      : `${finalFeet} feet ${finalInchesWhole} inches`;
  }

  if (unit === 'yd') {
    const yards = Math.floor(totalInches / 36);
    totalInches -= yards * 36;

    let feet = Math.floor(totalInches / 12);
    totalInches -= feet * 12;

    let inchesWhole = Math.floor(totalInches);
    const fractionDecimal = totalInches - inchesWhole;

    const nearest = FRACTIONS.reduce((a, b) =>
      Math.abs(b.decimal - fractionDecimal) < Math.abs(a.decimal - fractionDecimal) ? b : a
    );

    let finalFraction = nearest;
    if (nearest.decimal >= 0.999) {
      inchesWhole += 1;
      finalFraction = FRACTIONS[0];
    }

    // Handle inches overflow
    if (inchesWhole === 12) {
      inchesWhole = 0;
      feet += 1;
    }

    // Handle feet overflow
    if (feet === 3) {
      feet = 0;
      // Carry over yards
      return `${yards + 1} yards, ${feet} feet, and ${inchesWhole} ${finalFraction.unicode} inches`;
    }

    return finalFraction.unicode
      ? `${yards} yards, ${feet} feet, and ${inchesWhole} ${finalFraction.unicode} inches`
      : `${yards} yards, ${feet} feet, and ${inchesWhole} inches`;
  }

  throw new Error('Unsupported unit');
}

export function splitImperialParts(mm: number, unit: 'in' | 'ft' | 'yd'): ImperialParts {
  const decimalValue = convertToImperialDecimal(mm, unit);
  const abs = Math.abs(decimalValue);
  const whole = Math.floor(abs);
  const decimal = abs - whole;
  const decimalPart = `${Math.round(decimal * 100)}/100`;
  const nearest = FRACTIONS.reduce((a, b) =>
    Math.abs(b.decimal - decimal) < Math.abs(a.decimal - decimal) ? b : a
  );
  return {
    whole,
    decimal,
    decimalPart,
    fractionPart: nearest.unicode || '',
  };
}

// Example usage / test outputs:Fraction// console.log(formatImperialFraction(5000, 'in')); // "196 inches and 27⁄32"
// console.log(formatImperialFraction(5000, 'ft')); // "16 feet 4 inches and 27⁄32"
// console.log(formatImperialFraction(4902.09, 'yd')); // "5 yards, 2 feet, and 1 1⁄16 inches"

// console.log(formatImperialDecimal(5000, 'in')); // e.g., "196.8504 in"
// console.log(formatImperialDecimal(5000, 'ft')); // e.g., "16.4042 ft"
// console.log(formatImperialDecimal(4902.09, 'yd')); // e.g., "5.3610 yd"

// tsx libs/shared/measurement/src/lib/convert-imperial.ts