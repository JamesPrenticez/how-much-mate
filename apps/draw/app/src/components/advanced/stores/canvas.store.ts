import { create } from 'zustand';
import { Shape, View } from '../models';
import { initialConfig } from '../config';
import { clamp } from '../utils';
import { CanvasKit } from 'canvaskit-wasm';

type CanvasState = {
  view: View;
  setView: (view: Partial<View>) => void;
  canvasKit: CanvasKit | null;
  setCanvasKit: (canvasKit: CanvasKit) => void;
};

export const useCanvasStore = create<CanvasState>((set) => ({
  view: {
    x: initialConfig.x,
    y: initialConfig.y,
    scale: clamp(initialConfig.scale, initialConfig.minZoom, initialConfig.maxZoom),
  },
  setView: (view) => set((state) => ({ view: { ...state.view, ...view } })),
  canvasKit: null,
  setCanvasKit: (kit) => set({ canvasKit: kit }),
}));