import { create } from 'zustand';
import type { CalculatorData } from './calculator.type';

interface CalculatorStore {
    calculator: CalculatorData | null;
    createCalculator: (data: CalculatorData) => void;
    clearCalclator: () => void;
}

export const useCalculatorStore = create<CalculatorStore>((set) => ({
    calculator: null,
    createCalculator: (calculator) => {
        set({ calculator });
    },
    clearCalclator: () => set({ calculator: null }),
}));
