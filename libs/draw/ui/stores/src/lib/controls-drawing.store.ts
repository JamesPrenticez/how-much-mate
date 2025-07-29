import { produce } from 'immer';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface ControlsDrawingStore {
  isDrawing: boolean;
  activeDimensionGroup: string;
  setIsDrawing: (value: boolean) => void;
  setActiveDimentionGroup: (value: string) => void;
}

export const useControlsDrawingStore = create<ControlsDrawingStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    isDrawing: false,
    activeDimensionGroup: "",

    // Actions
    setIsDrawing: (isDrawing) =>
      set(
        produce<ControlsDrawingStore>((state) => {
          state.isDrawing = isDrawing;
        })
      ),

    setActiveDimentionGroup: (activeDimensionGroup) =>
      set(
        produce<ControlsDrawingStore>((state) => {
          state.activeDimensionGroup = activeDimensionGroup;
        })
      ),

  }))
);