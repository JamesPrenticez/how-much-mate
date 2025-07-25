import { produce } from 'immer';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type ViewBox = {
  x: number;
  y: number;
  w: number;
  h: number;
};

interface ControlsGridStore {
  snapToGrid: boolean;
  showGrid: boolean;
  viewBox: ViewBox;
  setSnapToGrid: (value: boolean) => void;
  setShowGrid: (value: boolean) => void;
  setViewBox: (value: ViewBox) => void;
}

export const useControlsGridStore = create<ControlsGridStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    snapToGrid: true,
    showGrid: true,
    viewBox: {
      x: -400,
      y: -300,
      w: 800,
      h: 600,
    },

    // Actions
    setSnapToGrid: (snapToGrid) =>
      set(
        produce<ControlsGridStore>((state) => {
          state.snapToGrid = snapToGrid;
        })
      ),

    setShowGrid: (showGrid) =>
      set(
        produce<ControlsGridStore>((state) => {
          state.showGrid = showGrid;
        })
      ),

    setViewBox: (viewBox) =>
      set(
        produce<ControlsGridStore>((state) => {
          state.viewBox = viewBox;
        })
      ),
  }))
);