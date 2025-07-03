import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { System, SystemType, type CalculatorData } from './calculator.type';
import { convertCalculatorInputs } from './sytem-conversions.util';

interface CalculatorStore {
    system: SystemType;
    setSystem: (system: SystemType) => void;
    calculator: CalculatorData | null;
    createCalculator: (data: CalculatorData) => void;
    clearCalclator: () => void;
}

export const useCalculatorStore = create<CalculatorStore>()(
  immer((set, get) => ({
    system: System.METRIC,
    calculator: null,

   setSystem: (system) => {
      set(state => {
        state.system = system;
        if (state.calculator) {
          state.calculator = convertCalculatorInputs(state.calculator, system);
        }
      });
    },

    createCalculator: (calculator) => {
        set({ calculator });
    },
    
    clearCalclator: () => set({ calculator: null }),
  }))
);
