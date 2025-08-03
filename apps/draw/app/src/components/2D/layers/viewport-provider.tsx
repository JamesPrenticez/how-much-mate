import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ViewportLimits, ViewportState } from './types';

interface ViewportContextType {
  viewport: ViewportState;
  limits: ViewportLimits;
  setZoom: (scale: number, centerX?: number, centerY?: number) => void;
  setPan: (offsetX: number, offsetY: number) => void;
  zoomIn: (centerX?: number, centerY?: number) => void;
  zoomOut: (centerX?: number, centerY?: number) => void;
  resetView: () => void;
  screenToWorld: (screenX: number, screenY: number) => { x: number; y: number };
  worldToScreen: (worldX: number, worldY: number) => { x: number; y: number };
}

const ViewportContext = createContext<ViewportContextType | null>(null);

export const useViewport = () => {
  const context = useContext(ViewportContext);
  if (!context) {
    throw new Error('useViewport must be used within a ViewportProvider');
  }
  return context;
};

interface ViewportProviderProps {
  children: ReactNode;
  initialScale?: number;
  limits?: Partial<ViewportLimits>;
}

export const ViewportProvider: React.FC<ViewportProviderProps> = ({
  children,
  initialScale = 1,
  limits: customLimits = {}
}) => {
  
  const limits: ViewportLimits = {
    minScale: 0.1,
    maxScale: 10,
    ...customLimits
  };

  const [viewport, setViewport] = useState<ViewportState>({
    scale: Math.max(limits.minScale, Math.min(limits.maxScale, initialScale)),
    offsetX: 0,
    offsetY: 0
  });

  const clampScale = useCallback((scale: number) => {
    return Math.max(limits.minScale, Math.min(limits.maxScale, scale));
  }, [limits]);

  const clampOffset = useCallback((offsetX: number, offsetY: number, scale: number) => {
    let clampedX = offsetX;
    let clampedY = offsetY;

    if (limits.maxOffsetX !== undefined) {
      clampedX = Math.max(-limits.maxOffsetX, Math.min(limits.maxOffsetX, offsetX));
    }
    if (limits.maxOffsetY !== undefined) {
      clampedY = Math.max(-limits.maxOffsetY, Math.min(limits.maxOffsetY, offsetY));
    }

    return { x: clampedX, y: clampedY };
  }, [limits]);

  const setZoom = useCallback((scale: number, centerX = 0, centerY = 0) => {
    const clampedScale = clampScale(scale);
    
    setViewport(prev => {
      // Calculate new offset to zoom towards the center point
      const scaleRatio = clampedScale / prev.scale;
      const newOffsetX = centerX - (centerX - prev.offsetX) * scaleRatio;
      const newOffsetY = centerY - (centerY - prev.offsetY) * scaleRatio;
      
      const clampedOffset = clampOffset(newOffsetX, newOffsetY, clampedScale);
      
      return {
        scale: clampedScale,
        offsetX: clampedOffset.x,
        offsetY: clampedOffset.y
      };
    });
  }, [clampScale, clampOffset]);

  const setPan = useCallback((offsetX: number, offsetY: number) => {
    setViewport(prev => {
      const clampedOffset = clampOffset(offsetX, offsetY, prev.scale);
      return {
        ...prev,
        offsetX: clampedOffset.x,
        offsetY: clampedOffset.y
      };
    });
  }, [clampOffset]);

  const zoomIn = useCallback((centerX = 0, centerY = 0) => {
    setZoom(viewport.scale * 1.2, centerX, centerY);
  }, [viewport.scale, setZoom]);

  const zoomOut = useCallback((centerX = 0, centerY = 0) => {
    setZoom(viewport.scale / 1.2, centerX, centerY);
  }, [viewport.scale, setZoom]);

  const resetView = useCallback(() => {
    setViewport({
      scale: initialScale,
      offsetX: 0,
      offsetY: 0
    });
  }, [initialScale]);

  const screenToWorld = useCallback((screenX: number, screenY: number) => {
    return {
      x: (screenX - viewport.offsetX) / viewport.scale,
      y: (screenY - viewport.offsetY) / viewport.scale
    };
  }, [viewport]);

  const worldToScreen = useCallback((worldX: number, worldY: number) => {
    return {
      x: worldX * viewport.scale + viewport.offsetX,
      y: worldY * viewport.scale + viewport.offsetY
    };
  }, [viewport]);

  const contextValue: ViewportContextType = {
    viewport,
    limits,
    setZoom,
    setPan,
    zoomIn,
    zoomOut,
    resetView,
    screenToWorld,
    worldToScreen
  };

  return (
    <ViewportContext.Provider value={contextValue}>
      {children}
    </ViewportContext.Provider>
  );
};