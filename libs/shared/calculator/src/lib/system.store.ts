import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export enum System {
  METRIC = 'metric',
  IMPERIAL = 'imperial'
}

export type SystemType = System.METRIC | System.IMPERIAL;

interface SystemStore {
    system: SystemType;
    setSystem: (system: SystemType) => void;
}

export const useSystemStore = create<SystemStore>()(
  immer((set, get) => ({
    system: System.METRIC,

   setSystem: (system) => {
      set(state => {
        state.system = system;
      });
    },
  }))
);
