import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { produce } from 'immer';
import { ViewportLimits, ViewportState } from "./types";

interface ViewportStore {
  viewport: ViewportState;
  limits: ViewportLimits;
  
  // Actions
  setZoom: (scale: number, centerX?: number, centerY?: number) => void;
  setPan: (offsetX: number, offsetY: number) => void;
  zoomIn: (centerX?: number, centerY?: number) => void;
  zoomOut: (centerX?: number, centerY?: number) => void;
  resetView: () => void;
  setLimits: (limits: Partial<ViewportLimits>) => void;
  
  // Utility functions (computed)
  screenToWorld: (screenX: number, screenY: number) => { x: number; y: number };
  worldToScreen: (worldX: number, worldY: number) => { x: number; y: number };
}

const DEFAULT_LIMITS: ViewportLimits = {
  minScale: 0.1,
  maxScale: 10,
};

const INITIAL_VIEWPORT: ViewportState = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};

export const useViewportStore = create<ViewportStore>()(
  subscribeWithSelector((set, get) => ({
    viewport: INITIAL_VIEWPORT,
    limits: DEFAULT_LIMITS,

    setZoom: (scale: number, centerX = 0, centerY = 0) => {
      set(
        produce<ViewportStore>((state) => {
        const { limits, viewport } = state;
        const clampedScale = Math.max(limits.minScale, Math.min(limits.maxScale, scale));
        
        // Calculate new offset to zoom towards the center point
        const scaleRatio = clampedScale / viewport.scale;
        const newOffsetX = centerX - (centerX - viewport.offsetX) * scaleRatio;
        const newOffsetY = centerY - (centerY - viewport.offsetY) * scaleRatio;
        
        // Clamp offsets
        let clampedOffsetX = newOffsetX;
        let clampedOffsetY = newOffsetY;
        
        if (limits.maxOffsetX !== undefined) {
          clampedOffsetX = Math.max(-limits.maxOffsetX, Math.min(limits.maxOffsetX, newOffsetX));
        }
        if (limits.maxOffsetY !== undefined) {
          clampedOffsetY = Math.max(-limits.maxOffsetY, Math.min(limits.maxOffsetY, newOffsetY));
        }
        
        state.viewport.scale = clampedScale;
        state.viewport.offsetX = clampedOffsetX;
        state.viewport.offsetY = clampedOffsetY;
      })
      )
    },

    setPan: (offsetX: number, offsetY: number) => {
      set(
        produce<ViewportStore>((state) => {
        const { limits } = state;
        
        let clampedOffsetX = offsetX;
        let clampedOffsetY = offsetY;
        
        if (limits.maxOffsetX !== undefined) {
          clampedOffsetX = Math.max(-limits.maxOffsetX, Math.min(limits.maxOffsetX, offsetX));
        }
        if (limits.maxOffsetY !== undefined) {
          clampedOffsetY = Math.max(-limits.maxOffsetY, Math.min(limits.maxOffsetY, offsetY));
        }
        
        state.viewport.offsetX = clampedOffsetX;
        state.viewport.offsetY = clampedOffsetY;
      })
    );
    },

    zoomIn: (centerX = 0, centerY = 0) => {
      const { viewport, setZoom } = get();
      setZoom(viewport.scale * 1.2, centerX, centerY);
    },

    zoomOut: (centerX = 0, centerY = 0) => {
      const { viewport, setZoom } = get();
      setZoom(viewport.scale / 1.2, centerX, centerY);
    },

    resetView: () => {
      set(
        produce<ViewportStore>((state) => {
        state.viewport.scale = 1;
        state.viewport.offsetX = 0;
        state.viewport.offsetY = 0;
      })
    );
    },

    setLimits: (newLimits: Partial<ViewportLimits>) => {
      set(produce<ViewportStore>((state) => {
        Object.assign(state.limits, newLimits);
        
        // Re-clamp current viewport to new limits
        state.viewport.scale = Math.max(
          state.limits.minScale,
          Math.min(state.limits.maxScale, state.viewport.scale)
        );
      })
    );
    },

    screenToWorld: (screenX: number, screenY: number) => {
      const { viewport } = get();
      return {
        x: (screenX - viewport.offsetX) / viewport.scale,
        y: (screenY - viewport.offsetY) / viewport.scale,
      };
    },

    worldToScreen: (worldX: number, worldY: number) => {
      const { viewport } = get();
      return {
        x: worldX * viewport.scale + viewport.offsetX,
        y: worldY * viewport.scale + viewport.offsetY,
      };
    },
  }))
);

export const initializeViewport = (initialScale = 1, limits: Partial<ViewportLimits> = {}) => {
  const store = useViewportStore.getState();
  store.setLimits({ ...DEFAULT_LIMITS, ...limits });
  store.resetView(); // Reset to initial state first
  store.setZoom(initialScale);
};
