// CanvasKit types
export interface CanvasKitInstance {
  MakeCanvasSurface: (canvas: HTMLCanvasElement) => Surface | null;
  Color: (r: number, g: number, b: number, a?: number) => Float32Array;
  parseColorString: (color: string) => Float32Array;
  XYWHRect: (x: number, y: number, w: number, h: number) => Float32Array;
  Path: new () => Path;
  Paint: new () => Paint;
  PaintStyle: {
    Fill: number;
    Stroke: number;
  };
  TRANSPARENT: Float32Array;
}

export interface Surface {
  getCanvas: () => Canvas;
  flush: () => void;
  delete: () => void;
}

export interface Canvas {
  clear: (color: Float32Array) => void;
  drawPaint: (paint: Paint) => void;
  drawRect: (rect: Float32Array, paint: Paint) => void;
  drawPath: (path: Path, paint: Paint) => void;
  save: () => void;
  restore: () => void;
  translate: (dx: number, dy: number) => void;
  scale: (sx: number, sy: number) => void;
}

export interface Paint {
  setColor: (color: Float32Array) => void;
  setStyle: (style: number) => void;
  setStrokeWidth: (width: number) => void;
  delete: () => void;
}

export interface Path {
  moveTo: (x: number, y: number) => void;
  lineTo: (x: number, y: number) => void;
  delete: () => void;
}

// Component types
export type View = { x: number; y: number; scale: number };

export type Shape = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  selected: boolean;
};

export type DrawFunction = (canvas: Canvas, view: View, dpr: number, CanvasKit: CanvasKitInstance) => void;

export type PannableCanvasKitProps = {
  width: number;
  height: number;
  draw: DrawFunction;
  initialScale?: number;
  initialX?: number;
  initialY?: number;
  className?: string;
  background?: string;
  enableZoom?: boolean;
  wheelZoomFactor?: number;
  minZoom?: number;
  maxZoom?: number;
};

export type PannableCanvasKitRef = {
  panTo: (x: number, y: number) => void;
  zoomTo: (scale: number, center?: { x: number; y: number }) => void;
  getView: () => View;
  getCanvasKit: () => CanvasKitInstance | null;
  getSurface: () => Surface | null;
};

