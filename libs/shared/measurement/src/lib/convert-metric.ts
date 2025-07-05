import { formatNumber } from "./measurement-formatter.util";
import { MetricUnit } from "./measurement.types";

export const toMetric = (mm: number, desiredUnit: MetricUnit): string => {
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