import { useCallback } from 'react';

type UpdateCallback = () => void;

const rafCallbacks = new Set<UpdateCallback>();
let rafId: number | null = null;

const processFrame = () => {
  rafId = null;
  // Execute all callbacks
  rafCallbacks.forEach(callback => callback());
  rafCallbacks.clear();
};

export const useSharedRAF = () => {
  const scheduleUpdate = useCallback((callback: UpdateCallback) => {
    rafCallbacks.add(callback);
    
    if (rafId === null) {
      rafId = requestAnimationFrame(processFrame);
    }
  }, []);

  return { scheduleUpdate };
};