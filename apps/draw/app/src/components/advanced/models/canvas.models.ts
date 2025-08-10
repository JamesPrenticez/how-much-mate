export interface CanvasKitInstance {
  MakeCanvasSurface: (canvas: HTMLCanvasElement) => Surface | null;
  Color: (r: number, g: number, b: number, a?: number) => Float32Array;
  parseColorString: (color: string) => Float32Array;
  XYWHRect: (x: number, y: number, w: number, h: number) => Float32Array;
  // LTRBRect: 
  Path: new () => Path;
  Paint: new () => Paint;
  PaintStyle: {
    Fill: number;
    Stroke: number;
  };
  TRANSPARENT: Float32Array;
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

export interface Surface {
  getCanvas: () => Canvas;
  flush: () => void;
  dispose: () => void; 
}

export type DrawFunction = (canvas: Canvas, canvasKit: CanvasKitInstance) => void;

export interface Path {
  moveTo: (x: number, y: number) => void;
  lineTo: (x: number, y: number) => void;
  delete: () => void;
}

export interface Paint {
  setColor: (color: Float32Array) => void;
  setStyle: (style: number) => void;
  setStrokeWidth: (width: number) => void;
  delete: () => void;
}

