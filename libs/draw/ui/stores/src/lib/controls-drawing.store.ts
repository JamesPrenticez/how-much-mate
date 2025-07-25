import { Group } from '@draw/models';
import { produce } from 'immer';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface ControlsDrawingStore {
  isDrawing: boolean;
  activeDimensionGroup: Group;
  setIsDrawing: (value: boolean) => void;
  setActiveDimentionGroup: (value: Group) => void;
}

export const useControlsDrawingStore = create<ControlsDrawingStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    isDrawing: false,
    activeDimensionGroup: Group.OTHER,

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