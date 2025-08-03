export interface CanvasLayerProps {
  width: number;
  height: number;
  zIndex: number;
}

export interface ViewportState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface ViewportLimits {
  minScale: number;
  maxScale: number;
  maxOffsetX?: number;
  maxOffsetY?: number;
}