import { create } from 'zustand';

export enum UnitSystems {
  METRIC = 'metric',
  IMPERIAL = 'imperial'
}

export type UnitSystem = UnitSystems.METRIC | UnitSystems.IMPERIAL;
type MetricUnit = 'mm' | 'cm' | 'm';
type ImperialUnit = 'in' | 'ft';

type MeasurementStore = {
  system: UnitSystem;
  metricUnit: MetricUnit;
  imperialUnit: ImperialUnit;
  setSystem: (system: UnitSystem) => void;
  setMetricUnit: (unit: MetricUnit) => void;
  setImperialUnit: (unit: ImperialUnit) => void;
  convertToMetric: (value: number, from: ImperialUnit, to: MetricUnit) => number;
  convertToImperial: (value: number, from: MetricUnit, to: ImperialUnit) => number;
};

export const useMeasurementStore = create<MeasurementStore>((set) => ({
  system: UnitSystems.METRIC,
  metricUnit: 'cm',
  imperialUnit: 'in',

  setSystem: (system) => set({ system }),
  setMetricUnit: (metricUnit) => set({ metricUnit }),
  setImperialUnit: (imperialUnit) => set({ imperialUnit }),

  convertToMetric: (value, from, to) => {
    let inches = from === 'in' ? value : value * 12; // ft → in
    let cm = inches * 2.54;

    switch (to) {
      case 'mm': return cm * 10;
      case 'cm': return cm;
      case 'm': return cm / 100;
    }
  },

  convertToImperial: (value, from, to) => {
    let cm = from === 'mm' ? value / 10 : from === 'm' ? value * 100 : value;
    let inches = cm / 2.54;
    return to === 'in' ? inches : inches / 12; // in → ft
  },
}));
