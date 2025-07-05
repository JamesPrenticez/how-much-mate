import { describe, it, expect } from 'vitest';
import { formatMeasurement, System } from './measurement-formatter.util';

//  npx nx test shared-calculator

describe('formatMeasurement', () => {
  it('formats metric mm', () => {
    expect(formatMeasurement(1234, System.METRIC, 'mm')).toBe('1,234 mm');
  });

  it('formats metric cm', () => {
    expect(formatMeasurement(1234, System.METRIC, 'cm')).toBe('123.4 cm');
  });

  it('formats metric m', () => {
    expect(formatMeasurement(1234, System.METRIC, 'm')).toBe('1.23 m');
  });

  it('formats imperial inches with fraction', () => {
    const result = formatMeasurement(1234, System.IMPERIAL, 'in');
    expect(result).toMatch(/^48.* in$/); // e.g., "48½ in"
  });

  it('formats imperial feet', () => {
    const result = formatMeasurement(1234, System.IMPERIAL, 'ft');
    expect(result).toMatch(/^4.05 ft$/);
  });

  it('throws on invalid unit for metric', () => {
    expect(() => formatMeasurement(1000, System.METRIC, 'in')).toThrow(
      'Invalid unit for the selected system'
    );
  });

  it('throws on invalid unit for imperial', () => {
    expect(() => formatMeasurement(1000, System.IMPERIAL, 'mm')).toThrow(
      'Invalid unit for the selected system'
    );
  });

  // Edge cases
  it('handles zero correctly', () => {
    expect(formatMeasurement(0, System.METRIC, 'mm')).toBe('0 mm');
    expect(formatMeasurement(0, System.METRIC, 'cm')).toBe('0 cm');
    expect(formatMeasurement(0, System.METRIC, 'm')).toBe('0 m');
    expect(formatMeasurement(0, System.IMPERIAL, 'in')).toBe('0 in');
    expect(formatMeasurement(0, System.IMPERIAL, 'ft')).toBe('0 ft');
  });

  it('handles negative values', () => {
    expect(formatMeasurement(-1234, System.METRIC, 'mm')).toBe('-1,234 mm');
    const result = formatMeasurement(-1234, System.IMPERIAL, 'in');
    expect(result.startsWith('-')).toBe(true);
  });

  it('handles very large values', () => {
    const large = 123456789;
    expect(formatMeasurement(large, System.METRIC, 'm')).toMatch(
      /123,456\.79 m/
    );
    const feet = formatMeasurement(large, System.IMPERIAL, 'ft');
    expect(feet).toMatch(/ft$/);
  });

  it('handles very small fractions in inches', () => {
    const small = 1; // ≈0.039 in → nearest fraction 1⁄32
    const result = formatMeasurement(small, System.IMPERIAL, 'in');
    expect(result).toBe('¹⁄₃₂ in'); // note: check actual Unicode used
  });
});
